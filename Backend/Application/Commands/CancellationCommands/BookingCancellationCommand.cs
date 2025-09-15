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
    ICancellationRepository cancellationRepository,IWaitingRepository waitingRepository,ITrainScheduleRepository trainScheduleRepository,ICurrentUserService currentUserService,IEmailNotificationService emailNotificationService,IUnitOfWork unitOfWork) : IRequestHandler<BookingCancellationCommand>
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
         await emailNotificationService.SendBookingCancellationAsync(booking,cancelPassengers,refund);

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

            var trainScheduleStations = await trainScheduleRepository.GetTrainSchedulesByCoachIdAsync(cancelled.Seat.CoachId);
            var fromStation = trainScheduleStations.FirstOrDefault(s => s.StationId == cancelled.Booking.FromStationId);
            var toStation = trainScheduleStations.FirstOrDefault(s => s.StationId == cancelled.Booking.ToStationId);
            foreach (var wait in waitlist)
            {
                var waitToStation = trainScheduleStations.FirstOrDefault(s => s.StationId == wait.ToStationId);
                var waitFromStation = trainScheduleStations.FirstOrDefault(s => s.StationId == wait.FromStationId);

                if (IsOverlapping(fromStation.DistanceFromSource,toStation.DistanceFromSource,waitFromStation.DistanceFromSource, waitToStation.DistanceFromSource))
                    continue;

                // Update waitlisted passenger
                var passenger = await passengerRepository.GetPassengerById(wait.PassengerId);
                passenger.SeatId = cancelled.SeatId;
                passenger.Status = BookingStatus.Confirmed;
                passenger.CoachClass = cancelled.CoachClass;

                 waitingRepository.DeleteWaitlistEntryAsync(wait);
                await unitOfWork.SaveChangesAsync();

                await emailNotificationService.SendWaitlistPromotionEmailAsync(passenger);

                break; // 1 seat = 1 passenger
            }
        }

        await unitOfWork.SaveChangesAsync();
    }

    private bool IsOverlapping(int from1, int to1, int from2, int to2)
    {
        return !(to2 <= from1 || from2 >= to1 || (from1 == from2 && to1 == to2));
    }


}