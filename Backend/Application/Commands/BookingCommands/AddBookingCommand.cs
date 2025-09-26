using System.Collections.Concurrent;
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
    private static readonly ConcurrentDictionary<int, SemaphoreSlim> _trainLocks = new();
    private SemaphoreSlim GetTrainLock(int trainId)
    {
        return _trainLocks.GetOrAdd(trainId, _ => new SemaphoreSlim(1, 1));
    }

    public async Task<PassengerBookingInfoDTO> Handle(AddBookingCommand request, CancellationToken cancellationToken)
    {
        var trainLock = GetTrainLock(request.TrainId);
        await trainLock.WaitAsync(cancellationToken);
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
            trainLock.Release();
        }
    }
    private async Task<List<Seat>> GetAvailableSeats(Train train, BookingRequestDTO bookingRequestDto)
    {
        if (!Enum.TryParse<CoachClass>(bookingRequestDto.CoachClass, true, out var parsedClass))
            throw new ArgumentException($"Invalid coach class: {bookingRequestDto.CoachClass}");

        var availableSeats = new List<Seat>();

        foreach (var coach in train.Coaches.Where(c => c.CoachClass == parsedClass))
        {
            var coachSeats = await seatRepository.GetAvailableSeatsAsync(
                coach.CoachId,
                bookingRequestDto.JourneyDate,
                bookingRequestDto.FromStationId,
                bookingRequestDto.ToStationId);

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
        var passengers = new List<Passenger>();
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
            }
            else
            {
                passenger.Status = BookingStatus.Waiting;

            }
            passengers.Add(passenger);
        }
        await passengerRepository.AddPassengers(passengers);

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