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
    ICancellationRepository cancellationRepository,IWaitingRepository waitingRepository,ICurrentUserService currentUserService,IUnitOfWork unitOfWork) : IRequestHandler<BookingCancellationCommand>
{
    public async Task Handle(BookingCancellationCommand request, CancellationToken cancellationToken)
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
        await TryPromoteWaitlistedPassengersAsync(cancelPassengers);
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
                break; // 1 seat = 1 passenger
            }
        }

        await unitOfWork.SaveChangesAsync();
    }

    private bool IsOverlapping(int from1, int to1, int from2, int to2)
    {
        return !(to2 <= from1 || from2 >= to1);
    }
}