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
    IMapper mapper,
    IUnitOfWork unitOfWork) : IRequestHandler<AddBookingCommand, PassengerBookingInfoDTO>
{
    public async Task<PassengerBookingInfoDTO> Handle(AddBookingCommand request, CancellationToken cancellationToken)
    {
        var bookingDetails = request.bookingRequest;
        var train = await trainRepository.GetTrainByIdAsync(request.trainId);

        var requestedCoach = train.Coaches
            .Where(c => c.CoachClass == bookingDetails.CoachClass);

        var availableSeats = new List<Seat>();
        var numberOfSeatsToBook = bookingDetails.Passangers.Count;

        foreach (var coach in requestedCoach)
        {
            availableSeats.AddRange(
                await seatRepository.GetAvailableSeatsAsync(coach.CoachId, bookingDetails.JourneyDate,bookingDetails.FromStationId,bookingDetails.ToStationId));
        }

        if (availableSeats.Count < numberOfSeatsToBook)
            throw new Exception("Not enough seats available");

        var distance = await trainScheduleRepository
            .GetDistanceBetweenStationsAsync(bookingDetails.FromStationId, bookingDetails.ToStationId);

        var fare = CalucalateFare(bookingDetails.CoachClass, numberOfSeatsToBook, distance);

        var booking = new Booking
        {
            FromStationId = bookingDetails.FromStationId,
            ToStationId = bookingDetails.ToStationId,
            TrainId = request.trainId,
            UserId = request.userId,
            JourneyDate = bookingDetails.JourneyDate,
            TotalFare = fare
        };

        await bookingRepository.AddBooking(booking);
        await unitOfWork.SaveChangesAsync();

        for (int i = 0; i < numberOfSeatsToBook; i++)
        {
            var seat = availableSeats[i];
            var passengerInfo = bookingDetails.Passangers[i];

            var passenger = new Passenger
            {
                BookingId = booking.BookingId,
                Name = passengerInfo.Name,
                Age = passengerInfo.Age,
                Gender = passengerInfo.Gender,
                CoachId = seat.CoachId,
                SeatId = seat.SeatId,
                Status = BookingStatus.Confirmed
            };

            await passengerRepository.AddPassenger(passenger);
        }

        await unitOfWork.SaveChangesAsync();


        var completeBooking = await bookingRepository.GetBookingWithDetailsByPNR(booking.PNR);

        return mapper.Map<PassengerBookingInfoDTO>(completeBooking);
    }

    private int CalucalateFare(CoachClass coachClass, int seatsToBook, int distance)
    {
        return (int)coachClass * distance * seatsToBook;
    }
}