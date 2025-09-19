using Application.Common.Interfaces;
using Application.DTOs.CancellationDTOs;
using Application.Exceptions;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using MediatR;

namespace Application.Commands.CancellationCommands;

public record BookingCancellationCommand(CancellationRequestDTO CancellationRequest) : IRequest;

public class BookingCancellationCommandHandler(IBookingRepository bookingRepository, IPassengerRepository passengerRepository,
    ICancellationRepository cancellationRepository, IWaitingRepository waitingRepository, ITrainScheduleRepository trainScheduleRepository, ICurrentUserService currentUserService, IEmailNotificationService emailNotificationService, IUnitOfWork unitOfWork) : IRequestHandler<BookingCancellationCommand>
{
    private static readonly SemaphoreSlim _bookingLock = new(1, 1);

    public async Task Handle(BookingCancellationCommand request, CancellationToken cancellationToken)
    {
        await _bookingLock.WaitAsync();
        try
        {
            var cancellationRequest = request.CancellationRequest;

            if (!currentUserService.UserId.HasValue)
            {
                throw new UnauthorizedAccessException("User not authenticated");
            }
            var booking = await bookingRepository.GetBookingWithDetailsByPNR(cancellationRequest.PNR);
            if (booking == null)
            {
                throw new NotFoundException("Invalid PNR");
            }
            var userId = currentUserService.UserId.Value;
            if (booking.UserId != userId)
            {
                throw new UnauthorizedAccessException("User not authorized");
            }

            var cancelPassengers = booking.Passengers
                .Where(p => cancellationRequest.PassengerIds.Contains(p.PassengerId) && p.Status != BookingStatus.Cancelled)
                .ToList();
            if (!cancelPassengers.Any())
            {
                throw new NotFoundException("Passenger not found");
            }
            decimal refund = (booking.TotalFare / booking.Passengers.Count)* cancelPassengers.Count;
            cancelPassengers.ForEach(p => p.Status = BookingStatus.Cancelled);

            var cancellation = new Cancellation
            {
                BookingId = booking.BookingId,
                CancelledByUserId = booking.UserId,
                Reason = cancellationRequest.Reason,
                TotalRefundAmount = refund
            };
            await cancellationRepository.AddCancellation(cancellation);
            await unitOfWork.SaveChangesAsync();
            await emailNotificationService.SendBookingCancellationAsync(booking, cancelPassengers, refund);

            await TryPromoteWaitlistedPassengersAsync(cancelPassengers);
        }
        finally
        {
            _bookingLock.Release();
        }
    }
    //find confirmedseat and check them also if they confilit by waitlist
    public  async Task TryPromoteWaitlistedPassengersAsync(List<Passenger> cancelledPassengers)
    {
        foreach (var cancelled in cancelledPassengers)
        {
            if (cancelled.SeatId == null) continue;

            var waitlist = await waitingRepository.GetWaitlistedPassengerOfTrainByCoachClassAndDate(
                                    cancelled.Booking.TrainId,
                                    cancelled.Booking.JourneyDate,
                                    cancelled.CoachClass.ToString());

            var trainScheduleStations = await GetTrainScheduleStationsAsync(cancelled);
            var confirmedOnSeat = GetConfirmedPassengersOnSeat(cancelled);

            await TryPromoteOneFromWaitlist(cancelled, waitlist, trainScheduleStations, confirmedOnSeat);
        }
    }

    private async Task<List<TrainSchedule>> GetTrainScheduleStationsAsync(Passenger cancelled)
    {
        return await trainScheduleRepository.GetTrainSchedulesByCoachIdAsync(cancelled.Seat.CoachId);
    }

    private List<Passenger> GetConfirmedPassengersOnSeat(Passenger cancelled)
    {
        return cancelled.Booking.Passengers
            .Where(p => p.Status == BookingStatus.Confirmed && p.SeatId == cancelled.SeatId)
            .ToList();
    }

    private async Task TryPromoteOneFromWaitlist(
        Passenger cancelled,
        IEnumerable<TrainWaitlist> waitlist,
        List<TrainSchedule> trainScheduleStations,
        List<Passenger> confirmedOnSeat)
    {
        foreach (var wait in waitlist)
        {
            if (!DoesOverlapWithConfirmed(wait, confirmedOnSeat, trainScheduleStations))
            {
                await PromotePassengerAsync(wait, cancelled);
                break; // one waitlisted passenger promoted per seat
            }
        }
    }

    private bool DoesOverlapWithConfirmed(
        TrainWaitlist wait,
        List<Passenger> confirmedOnSeat,
        List<TrainSchedule> trainScheduleStations)
    {
        var waitFromStation = trainScheduleStations.FirstOrDefault(s => s.StationId == wait.FromStationId);
        var waitToStation = trainScheduleStations.FirstOrDefault(s => s.StationId == wait.ToStationId);

        foreach (var confirmed in confirmedOnSeat)
        {
            var confFrom = trainScheduleStations.FirstOrDefault(s => s.StationId == confirmed.Booking.FromStationId);
            var confTo = trainScheduleStations.FirstOrDefault(s => s.StationId == confirmed.Booking.ToStationId);

            if (IsOverlapping(
                    waitFromStation.DistanceFromSource,
                    waitToStation.DistanceFromSource,
                    confFrom.DistanceFromSource,
                    confTo.DistanceFromSource))
            {
                return true;
            }
        }
        return false;
    }

    private async Task PromotePassengerAsync(TrainWaitlist wait, Passenger cancelled)
    {
        var passenger = await passengerRepository.GetPassengerById(wait.PassengerId);
        passenger.SeatId = cancelled.SeatId;
        passenger.Status = BookingStatus.Confirmed;
        passenger.CoachClass = cancelled.CoachClass;

        wait.Status = BookingStatus.Confirmed;

        await unitOfWork.SaveChangesAsync();
        await emailNotificationService.SendWaitlistPromotionEmailAsync(passenger);
    }

    private bool IsOverlapping(int from1, int to1, int from2, int to2)
    {
        return !(to2 <= from1 || from2 >= to1 || (from1 == from2 && to1 == to2));
    }



}