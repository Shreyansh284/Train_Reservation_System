using Application.DTOs.BookingDTOs;
using AutoMapper;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using MediatR;

namespace Application.Commands.BookingCommands;

public record AddBookingCommand(int trainId,int userId,BookingRequestDTO bookingRequest):IRequest<PassengerBookingInfoDTO>;
public class AddBookingCommandHandler(
    ITrainRepository trainRepository,
    ISeatRepository seatRepository,
    IBookingRepository bookingRepository,
    ITrainScheduleRepository trainScheduleRepository,
    IPassengerRepository passengerRepository,
    IWaitingRepository waitingRepository,
    IMapper mapper,
    IUnitOfWork unitOfWork) : IRequestHandler<AddBookingCommand, PassengerBookingInfoDTO>
{
    public async Task<PassengerBookingInfoDTO> Handle(AddBookingCommand request, CancellationToken cancellationToken)
    {
        var bookingDetails = request.bookingRequest;
        var train = await trainRepository.GetTrainByIdAsync(request.trainId);

        var availableSeats = await GetAvailableSeats(train, bookingDetails);
        var distance = await trainScheduleRepository
            .GetDistanceBetweenStationsAsync(bookingDetails.FromStationId, bookingDetails.ToStationId);

        int confirmedCount = Math.Min(availableSeats.Count, bookingDetails.Passangers.Count);
        int totalFare = CalucalateFare(bookingDetails.CoachClass, confirmedCount, distance);

        var booking = await CreateBookingAsync(request, bookingDetails, totalFare);

        await AddPassengersAsync(booking, bookingDetails, availableSeats, confirmedCount);

        await AddToWaitlistAsync(booking, bookingDetails, confirmedCount, train);

        var completeBooking = await bookingRepository.GetBookingWithDetailsByPNR(booking.PNR);
        return mapper.Map<PassengerBookingInfoDTO>(completeBooking);
    }

    private async Task<List<Seat>> GetAvailableSeats(Train train, BookingRequestDTO details)
    {
        var availableSeats = new List<Seat>();

        foreach (var coach in train.Coaches.Where(c => c.CoachClass == details.CoachClass))
        {
            var coachSeats = await seatRepository.GetAvailableSeatsAsync(
                coach.CoachId, details.JourneyDate, details.FromStationId, details.ToStationId);
            availableSeats.AddRange(coachSeats);
        }

        return availableSeats;
    }

    private int CalucalateFare(CoachClass coachClass, int seatsToBook, int distance)
    {
        return (int)coachClass * distance * seatsToBook;
    }

    private async Task<Booking> CreateBookingAsync(AddBookingCommand request, BookingRequestDTO details, int fare)
    {
        var booking = new Booking
        {
            FromStationId = details.FromStationId,
            ToStationId = details.ToStationId,
            TrainId = request.trainId,
            UserId = request.userId,
            JourneyDate = details.JourneyDate,
            TotalFare = fare
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
                Gender = pInfo.Gender
            };

            if (i < confirmedCount)
            {
                passenger.SeatId = i<seats.Count ? seats[i].SeatId:null;
                // passenger.CoachId = seats[i].CoachId;
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

    private async Task AddToWaitlistAsync(Booking booking, BookingRequestDTO details, int confirmedCount, Train train)
    {
        var passengers = await passengerRepository.GetPassengerByBookingIdAsync(booking.BookingId);
        var passengersInWaiting=passengers.Where(p=>p.Status == BookingStatus.Waiting).ToList();
        if (!passengersInWaiting.Any())
        {
            return;
        }

        foreach (var passenger in passengersInWaiting)
        {
            var waitlist = new TrainWaitlist
            {
                BookingId = booking.BookingId,
                PassengerId = passenger.PassengerId,
                TrainId = booking.TrainId,
                CoachClass = details.CoachClass,
                FromStationId = booking.FromStationId,
                ToStationId = booking.ToStationId,
                JourneyDate = booking.JourneyDate
            };

            await waitingRepository.AddWaitlistEntryAsync(waitlist);
        }

        await unitOfWork.SaveChangesAsync();
    }
}