using Application.Common.Interfaces;
using Application.DTOs.CancellationDTOs;
using Application.Exceptions;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using MediatR;

namespace Application.Commands.CancellationCommands;

public  record BookingCancellationCommand(CancellationRequestDTO cancellationRequest):IRequest;

public class BookingCancellationCommandHandler(IBookingRepository bookingRepository,IPassengerRepository passengerRepository,
    ICancellationRepository cancellationRepository,IWaitingRepository waitingRepository,ICurrentUserService currentUserService,IEmailService emailService,IUnitOfWork unitOfWork) : IRequestHandler<BookingCancellationCommand>
{
    private static readonly SemaphoreSlim _bookingLock = new(1, 1);

    public async Task Handle(BookingCancellationCommand request, CancellationToken cancellationToken)
    {
        await _bookingLock.WaitAsync();
        try
        {
        var cancellationRequest=request.cancellationRequest;

        if (!currentUserService.UserId.HasValue)
        {
            throw new UnauthorizedAccessException("User not authenticated");
        }
        var booking = await bookingRepository.GetBookingWithDetailsByPNR(cancellationRequest.PNR);
        if (booking == null)
        {
            throw new NotFoundException("InValid PNR");
        }
        var userId = currentUserService.UserId.Value;
        if (booking.UserId != userId)
        {
            throw new UnauthorizedAccessException("User not authorized");
        }

        var cancelPassengers =  booking.Passengers
            .Where(p => cancellationRequest.PassengerIds.Contains(p.PassengerId) && p.Status != BookingStatus.Cancelled)
            .ToList();
        if (!cancelPassengers.Any())
        {
            throw new NotFoundException("Passenger not found");
        }
        decimal refund = 0;

        foreach (var passenger in cancelPassengers)
        {
            passenger.Status = BookingStatus.Cancelled;
            refund += booking.TotalFare/booking.Passengers.Count;
        }
        var cancellation = new Cancellation
        {
            BookingId = booking.BookingId,
            CancelledByUserId = booking.UserId,
            Reason = cancellationRequest.Reason,
            TotalRefundAmount = refund
        };
        await cancellationRepository.AddCancellation(cancellation);
        await unitOfWork.SaveChangesAsync();
        var htmlMessage = BuildCancellationHtmlMessage(booking, cancelPassengers, refund);
        await emailService.SendEmailAsync(
            booking.User.Email,
            "Booking Cancellation Confirmation",
            htmlMessage
        );


            await TryPromoteWaitlistedPassengersAsync(cancelPassengers);
        }
        finally
        {
            _bookingLock.Release();
        }
    }
    private async Task TryPromoteWaitlistedPassengersAsync(List<Passenger> cancelledPassengers)
    {
        foreach (var cancelled in cancelledPassengers)
        {
            if (cancelled.SeatId == null) continue;

            var waitlist = await waitingRepository.GetWaitlistedPassengerOfTrainByCoachClassAndDate(cancelled.Booking.TrainId, cancelled.Booking.JourneyDate, cancelled.CoachClass.ToString());

            foreach (var wait in waitlist)
            {
                if (!IsOverlapping(cancelled.Booking.FromStationId, cancelled.Booking.ToStationId,
                        wait.FromStationId, wait.ToStationId))
                    continue;

                // Update waitlisted passenger
                var passenger = await passengerRepository.GetPassengerById(wait.PassengerId);
                passenger.SeatId = cancelled.SeatId;
                passenger.Status = BookingStatus.Confirmed;
                passenger.CoachClass = cancelled.CoachClass;

                 waitingRepository.DeleteWaitlistEntryAsync(wait);
                 await SendWaitlistPromotionEmailAsync(passenger);

                break; // 1 seat = 1 passenger
            }
        }

        await unitOfWork.SaveChangesAsync();
    }

    private bool IsOverlapping(int from1, int to1, int from2, int to2)
    {
        return !(to2 <= from1 || from2 >= to1);
    }
    private string BuildCancellationHtmlMessage(Booking booking, List<Passenger> cancelledPassengers, decimal refundAmount)
{
    var passengerRows = string.Join("", cancelledPassengers.Select(p => $@"
        <tr>
            <td style='padding:8px;border:1px solid #ddd'>{p.Name}</td>
            <td style='padding:8px;border:1px solid #ddd'>{p.Age}</td>
            <td style='padding:8px;border:1px solid #ddd'>{p.Gender}</td>
            <td style='padding:8px;border:1px solid #ddd'>{p.Status}</td>
        </tr>
    "));

    return $@"
    <html>
        <body style='font-family:Arial, sans-serif;line-height:1.6;color:#333'>
            <div style='max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,0.1)'>
                <h2 style='text-align:center;color:#d9534f'>Booking Cancellation Confirmation</h2>
                <p>Hello <strong>{booking.User?.FullName ?? "Customer"}</strong>,</p>
                <p>Your booking with <strong>PNR: {booking.PNR}</strong> has been cancelled for the following passengers:</p>
                
                <table style='width:100%;border-collapse:collapse;margin-top:15px'>
                    <thead>
                        <tr style='background-color:#f2f2f2'>
                            <th style='padding:8px;border:1px solid #ddd'>Name</th>
                            <th style='padding:8px;border:1px solid #ddd'>Age</th>
                            <th style='padding:8px;border:1px solid #ddd'>Gender</th>
                            <th style='padding:8px;border:1px solid #ddd'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {passengerRows}
                    </tbody>
                </table>

                <p style='margin-top:20px'>
                    <strong>Total Refund Amount:</strong> ₹{refundAmount}
                </p>
                <p style='color:#d9534f'><em>Note: Refund will be processed within 5-7 working days.</em></p>
                
                <p>Thank you for using our service.</p>
                <p style='margin-top:20px;font-size:12px;color:#777;text-align:center'>
                    This is an automated message. Please do not reply.
                </p>
            </div>
        </body>
    </html>";
}
    private async Task SendWaitlistPromotionEmailAsync(Passenger passenger)
    {
        var booking = passenger.Booking;
        var train = booking.Train;

        string subject = $"🎉 Your Waitlisted Ticket is Now Confirmed - {train.TrainName}";
        string body = $@"
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <h2 style='color: green;'>Good News {passenger.Name}!</h2>
            <p>Your waitlisted ticket has just been <b>confirmed</b> 🎟️</p>
            <h3>Booking Details:</h3>
            <ul>
                <li><b>Train:</b> {train.TrainName} ({train.TrainNumber})</li>
                <li><b>From:</b> {booking.FromStation.StationName}</li>
                <li><b>To:</b> {booking.ToStation.StationName}</li>
                <li><b>Date:</b> {booking.JourneyDate:dd-MMM-yyyy}</li>
                <li><b>Coach:</b> {passenger.CoachClass}</li>
                <li><b>Seat:</b> {passenger.Seat?.SeatNumber}</li>
                <li><b>Status:</b> Confirmed ✅</li>
            </ul>
            <p>Please carry a valid ID proof while travelling.</p>
            <p style='margin-top:20px;'>Thank you for choosing <b>Our Railway</b>. Have a safe journey 🚆</p>
        </body>
        </html>";

        await emailService.SendEmailAsync(booking.User.Email, subject, body);
    }
}