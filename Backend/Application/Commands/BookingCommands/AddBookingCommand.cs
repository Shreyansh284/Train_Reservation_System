using Application.Common.Interfaces;
using Application.DTOs.BookingDTOs;
using Application.Exceptions;
using AutoMapper;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using MediatR;

namespace Application.Commands.BookingCommands;

public record AddBookingCommand(int TrainId, int UserId, BookingRequestDTO BookingRequest) : IRequest<PassengerBookingInfoDTO>;
public class AddBookingCommandHandler(
    ITrainRepository trainRepository,
    ISeatRepository seatRepository,
    IBookingRepository bookingRepository,
    IPassengerRepository passengerRepository,
    IWaitingRepository waitingRepository,
    IEmailNotificationService emailNotificationService,
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
            if (train == null)
            {
                throw new NotFoundException("Train Not Found");
            }

            var availableSeats = await GetAvailableSeats(train, bookingDetails);

            int confirmedPassengerCount = Math.Min(availableSeats.Count, bookingDetails.Passengers.Count);

            var booking = await CreateBooking(request, bookingDetails);

            await AddPassengersAsync(booking, bookingDetails, availableSeats, confirmedPassengerCount);

            await AddToWaitlistAsync(booking, bookingDetails);

            var completeBooking = await bookingRepository.GetBookingWithDetailsByPNR(booking.PNR);
            if (completeBooking == null)
            {
                throw new NotFoundException("Booking could not be loaded after creation.");
            }
            var passengerBookingInfoDTO = mapper.Map<PassengerBookingInfoDTO>(completeBooking);
            await emailNotificationService.SendBookingConfirmationAsync(passengerBookingInfoDTO, completeBooking);

            return passengerBookingInfoDTO;
        }
        finally
        {
            _bookingLock.Release();
        }
    }
    private async Task<List<Seat>> GetAvailableSeats(Train train, BookingRequestDTO bookingRequestDto)
    {
        var availableSeats = new List<Seat>();

        foreach (var coach in train.Coaches.Where(c => c.CoachClass.ToString() == bookingRequestDto.CoachClass))
        {
            var coachSeats = await seatRepository.GetAvailableSeatsAsync(
                coach.CoachId, bookingRequestDto.JourneyDate, bookingRequestDto.FromStationId, bookingRequestDto.ToStationId);
            availableSeats.AddRange(coachSeats);
        }

        return availableSeats;
    }

    private async Task<Booking> CreateBooking(AddBookingCommand request, BookingRequestDTO bookingRequestDto)
    {
        var booking = new Booking
        {
            FromStationId = bookingRequestDto.FromStationId,
            ToStationId = bookingRequestDto.ToStationId,
            TrainId = request.TrainId,
            UserId = request.UserId,
            JourneyDate = bookingRequestDto.JourneyDate,
            TotalFare = bookingRequestDto.TotalFare
        };

        await bookingRepository.AddBooking(booking);
        await unitOfWork.SaveChangesAsync();

        return booking;
    }

    private async Task AddPassengersAsync(Booking booking, BookingRequestDTO bookingRequestDto, List<Seat> seats, int confirmedPassengerCount)
    {
        for (int i = 0; i < bookingRequestDto.Passengers.Count; i++)
        {
            var passengerInfo = bookingRequestDto.Passengers[i];
            var passenger = new Passenger
            {
                BookingId = booking.BookingId,
                Name = passengerInfo.Name,
                Age = passengerInfo.Age,
                Gender = passengerInfo.Gender,
                CoachClass = Enum.Parse<CoachClass>(bookingRequestDto.CoachClass, true)
            };

            if (i < confirmedPassengerCount)
            {
                passenger.SeatId = i < seats.Count ? seats[i].SeatId : null;
                passenger.Status = BookingStatus.Confirmed;
                // passenger.CoachClass=seats[i].Coach.CoachClass;
            }
            else
            {
                passenger.Status = BookingStatus.Waiting;
            }

            await passengerRepository.AddPassenger(passenger);
        }

        await unitOfWork.SaveChangesAsync();
    }

    private async Task AddToWaitlistAsync(Booking booking, BookingRequestDTO bookingRequestDto)
    {
        var passengers = await passengerRepository.GetPassengerByBookingIdAsync(booking.BookingId);
        var waitingPassengers = passengers.Where(p => p.Status == BookingStatus.Waiting).ToList();
        if (!waitingPassengers.Any())
        {
            return;
        }

        Enum.TryParse(bookingRequestDto.CoachClass, true, out CoachClass coachClass);
        foreach (var passenger in waitingPassengers)
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