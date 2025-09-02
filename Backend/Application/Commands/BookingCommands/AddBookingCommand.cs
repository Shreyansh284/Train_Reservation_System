using Application.Common.Interfaces;
using Application.DTOs.BookingDTOs;
using AutoMapper;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using MediatR;

namespace Application.Commands.BookingCommands;

public record AddBookingCommand(int TrainId,int UserId,BookingRequestDTO BookingRequest):IRequest<PassengerBookingInfoDTO>;
public class AddBookingCommandHandler (
    ITrainRepository trainRepository,
    ISeatRepository seatRepository,
    IBookingRepository bookingRepository,
    IPassengerRepository passengerRepository,
    IWaitingRepository waitingRepository,
    IEmailService emailService,
    IMapper mapper,
    IUnitOfWork unitOfWork) : IRequestHandler<AddBookingCommand, PassengerBookingInfoDTO>
{
    private static readonly SemaphoreSlim _bookingLock = new(1, 1);

public async Task<PassengerBookingInfoDTO> Handle(AddBookingCommand request, CancellationToken cancellationToken)
{
    await _bookingLock.WaitAsync(cancellationToken);
    try
    {
        var bookingDetails = request.BookingRequest;
        var train = await trainRepository.GetTrainByIdAsync(request.TrainId);

        var availableSeats = await GetAvailableSeats(train, bookingDetails);

        int confirmedCount = Math.Min(availableSeats.Count, bookingDetails.Passangers.Count);

        var booking = await CreateBookingAsync(request, bookingDetails);

        await AddPassengersAsync(booking, bookingDetails, availableSeats, confirmedCount);

        await AddToWaitlistAsync(booking, bookingDetails);

        var completeBooking = await bookingRepository.GetBookingWithDetailsByPNR(booking.PNR);

        var bookingInfo = mapper.Map<PassengerBookingInfoDTO>(completeBooking);

        // ✅ Send booking confirmation email
string subject = $"Booking Confirmation - PNR {bookingInfo.PNR}";
bool hasWaiting = bookingInfo.Passengers.Any(p => p.BookingStatus == "WAITING" || p.BookingStatus == "RAC");

string body = $"""
<html>
<body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:0 auto; background:#fff; padding:20px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color:#2E86C1; text-align:center;">🎉 Check Booking Details!</h2>

        <p>Dear <strong>{completeBooking.User.FullName}</strong>,</p>
        <p>Your train booking has been successfully processed. Below are your journey details:</p>

        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
            <tr><td style="padding:8px; border:1px solid #ddd;"><strong>PNR</strong></td><td style="padding:8px; border:1px solid #ddd;">{bookingInfo.PNR}</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Train</strong></td><td style="padding:8px; border:1px solid #ddd;">{bookingInfo.TrainName}</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;"><strong>From</strong></td><td style="padding:8px; border:1px solid #ddd;">{bookingInfo.FromStation}</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;"><strong>To</strong></td><td style="padding:8px; border:1px solid #ddd;">{bookingInfo.ToStation}</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Journey Date</strong></td><td style="padding:8px; border:1px solid #ddd;">{bookingInfo.JourneyDate:dd MMM yyyy}</td></tr>
            <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Total Fare</strong></td><td style="padding:8px; border:1px solid #ddd;">₹{bookingInfo.TotalFare}</td></tr>
        </table>

        <h3 style="color:#2E86C1;">👥 Passenger Details</h3>
        <table style="width:100%; border-collapse:collapse; margin:10px 0;">
            <tr style="background:#f2f2f2;">
                <th style="padding:8px; border:1px solid #ddd; text-align:left;">Name</th>
                <th style="padding:8px; border:1px solid #ddd; text-align:left;">Age</th>
                <th style="padding:8px; border:1px solid #ddd; text-align:left;">Gender</th>
                <th style="padding:8px; border:1px solid #ddd; text-align:left;">Seat</th>
                <th style="padding:8px; border:1px solid #ddd; text-align:left;">Status</th>
            </tr>
            {string.Join("", bookingInfo.Passengers.Select(p => $"""
                <tr>
                    <td style="padding:8px; border:1px solid #ddd;">{p.Name}</td>
                    <td style="padding:8px; border:1px solid #ddd;">{p.Age}</td>
                    <td style="padding:8px; border:1px solid #ddd;">{p.Gender}</td>
                    <td style="padding:8px; border:1px solid #ddd;">{p.SeatNumber}</td>
                    <td style="padding:8px; border:1px solid #ddd; color:{(p.BookingStatus == "CONFIRMED" ? "green" : "red")}; font-weight:bold;">
                        {p.BookingStatus}
                    </td>
                </tr>
            """))}
        </table>

        {(hasWaiting ? "<p style='color:#C0392B; font-weight:bold; margin-top:15px;'>⚠️ You will be informed by email if waiting passengers get confirmed seats.</p>" : "")}

        <p style="margin-top:20px;">Please carry a valid ID proof while traveling.</p>
        <p style="margin-top:5px;">Wishing you a pleasant journey!</p>

        <br />
        <p>Regards,</p>
        <p><strong>Reservation Team</strong></p>
    </div>
</body>
</html>
""";


        await emailService.SendEmailAsync(completeBooking.User.Email, subject, body);

        return bookingInfo;
    }
    finally
    {
        _bookingLock.Release();
    }
}


    private async Task<List<Seat>> GetAvailableSeats(Train train, BookingRequestDTO details)
    {
        var availableSeats = new List<Seat>();

        foreach (var coach in train.Coaches.Where(c => c.CoachClass.ToString() == details.CoachClass))
        {
            var coachSeats = await seatRepository.GetAvailableSeatsAsync(
                coach.CoachId, details.JourneyDate, details.FromStationId, details.ToStationId);
            availableSeats.AddRange(coachSeats);
        }

        return availableSeats;
    }

    private async Task<Booking> CreateBookingAsync(AddBookingCommand request, BookingRequestDTO details)
    {
        var booking = new Booking
        {
            FromStationId = details.FromStationId,
            ToStationId = details.ToStationId,
            TrainId = request.TrainId,
            UserId = request.UserId,
            JourneyDate = details.JourneyDate,
            TotalFare = details.TotalFare
        };

        await bookingRepository.AddBooking(booking);
        await unitOfWork.SaveChangesAsync();

        return booking;
    }

    private async Task AddPassengersAsync(Booking booking, BookingRequestDTO details, List<Seat> seats, int confirmedCount)
    {
        for (int i = 0; i < details.Passangers.Count; i++)
        {
            var pInfo = details.Passangers[i];
            var passenger = new Passenger
            {
                BookingId = booking.BookingId,
                Name = pInfo.Name,
                Age = pInfo.Age,
                Gender = pInfo.Gender,
                CoachClass = Enum.Parse<CoachClass>(details.CoachClass, true)

            };

            if (i < confirmedCount)
            {
                passenger.SeatId = i<seats.Count ? seats[i].SeatId:null;
                passenger.Status = BookingStatus.Confirmed;
            }
            else
            {
                passenger.Status = BookingStatus.Waiting;
            }

            await passengerRepository.AddPassenger(passenger);
        }

        await unitOfWork.SaveChangesAsync();
    }

    private async Task AddToWaitlistAsync(Booking booking, BookingRequestDTO details)
    {
        var passengers = await passengerRepository.GetPassengerByBookingIdAsync(booking.BookingId);
        var passengersInWaiting=passengers.Where(p=>p.Status == BookingStatus.Waiting).ToList();
        if (!passengersInWaiting.Any())
        {
            return;
        }

        Enum.TryParse(details.CoachClass, true, out CoachClass coachClass);
        foreach (var passenger in passengersInWaiting)
        {
            var waitlist = new TrainWaitlist
            {
                BookingId = booking.BookingId,
                PassengerId = passenger.PassengerId,
                TrainId = booking.TrainId,
                CoachClass = coachClass,
                FromStationId = booking.FromStationId,
                ToStationId = booking.ToStationId,
                JourneyDate = booking.JourneyDate
            };

            await waitingRepository.AddWaitlistEntryAsync(waitlist);
        }

        await unitOfWork.SaveChangesAsync();
    }
}