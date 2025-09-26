using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Commands.BookingCommands;
using Application.Common.Interfaces;
using Application.DTOs.BookingDTOs;
using Application.Exceptions;
using AutoMapper;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Moq;
using Xunit;

namespace Application.Tests.Commands.BookingCommands
{
    public class AddBookingCommandHandlerTests
    {
        private readonly Mock<ITrainRepository> _trainRepo = new();
        private readonly Mock<ISeatRepository> _seatRepo = new();
        private readonly Mock<IBookingRepository> _bookingRepo = new();
        private readonly Mock<IPassengerRepository> _passengerRepo = new();
        private readonly Mock<IWaitingRepository> _waitingRepo = new();
        private readonly Mock<IEmailNotificationService> _emailService = new();
        private readonly Mock<IMapper> _mapper = new();
        private readonly Mock<IUnitOfWork> _unitOfWork = new();

        private AddBookingCommandHandler CreateHandler()
        {
            return new AddBookingCommandHandler(
                _trainRepo.Object,
                _seatRepo.Object,
                _bookingRepo.Object,
                _passengerRepo.Object,
                _waitingRepo.Object,
                _emailService.Object,
                _mapper.Object,
                _unitOfWork.Object
            );
        }

        [Fact]
        public async Task Handle_ShouldThrow_WhenTrainNotFound()
        {
            // Arrange
            _trainRepo.Setup(r => r.GetTrainByIdAsync(It.IsAny<int>()))
                .ReturnsAsync((Train?)null);

            var command = new AddBookingCommand(1, 1, new BookingRequestDTO());

            var handler = CreateHandler();

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() =>
                handler.Handle(command, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_ShouldCreateBooking_WhenSeatsAvailable()
        {
            // Arrange
            var train = new Train
            {
                TrainId = 1,
                Coaches = new List<Coach>
                {
                    new Coach { CoachId = 10, CoachClass = CoachClass.SL }
                }
            };

            var request = new BookingRequestDTO
            {
                FromStationId = 1,
                ToStationId = 2,
                JourneyDate = DateTime.Today,
                TotalFare = 500,
                CoachClass = "SL",
                Passengers = new List<GetPassengerInfo>
                {
                    new GetPassengerInfo { Name = "John", Age = 30, Gender = GenderType.Male }
                }
            };

            var command = new AddBookingCommand(1, 99, request);

            var booking = new Booking { BookingId = 100, PNR = 1000027, TrainId = 1 };

            _trainRepo.Setup(r => r.GetTrainByIdAsync(1)).ReturnsAsync(train);
            _seatRepo.Setup(r => r.GetAvailableSeatsAsync(10, request.JourneyDate, 1, 2))
                     .ReturnsAsync(new List<Seat> { new Seat { SeatId = 55, CoachId = 10 } });

            _bookingRepo.Setup(r => r.AddBooking(It.IsAny<Booking>()))
                        .Callback<Booking>(b => b.BookingId = booking.BookingId);

            _bookingRepo.Setup(r => r.GetBookingWithDetailsByPNR(1000027))
                        .ReturnsAsync(booking);

            _mapper.Setup(m => m.Map<PassengerBookingInfoDTO>(It.IsAny<Booking>()))
                   .Returns(new PassengerBookingInfoDTO());

            var handler = CreateHandler();

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            _bookingRepo.Verify(r => r.AddBooking(It.IsAny<Booking>()), Times.Once);
            _passengerRepo.Verify(r => r.AddPassengers(It.IsAny<List<Passenger>>()), Times.AtLeastOnce);
            _unitOfWork.Verify(r => r.SaveChangesAsync(), Times.AtLeastOnce);
            _emailService.Verify(e => e.SendBookingConfirmationAsync(It.IsAny<PassengerBookingInfoDTO>(), booking), Times.Once);
        }

        [Fact]
        public async Task Handle_ShouldThrow_WhenBookingNotLoaded()
        {
            // Arrange
            var train = new Train { TrainId = 1, Coaches = new List<Coach>() };
            _trainRepo.Setup(r => r.GetTrainByIdAsync(1)).ReturnsAsync(train);

            var request = new BookingRequestDTO
            {
                FromStationId = 1,
                ToStationId = 2,
                JourneyDate = DateTime.Today,
                TotalFare = 100,
                CoachClass = "SL",
                Passengers = new List<GetPassengerInfo> { new GetPassengerInfo { Name = "Test", Age = 25, Gender = GenderType.Male } }
            };

            _bookingRepo.Setup(r => r.GetBookingWithDetailsByPNR(It.IsAny<long>()))
                        .ReturnsAsync((Booking?)null);

            var command = new AddBookingCommand(1, 1, request);
            var handler = CreateHandler();

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() =>
                handler.Handle(command, CancellationToken.None));
        }       
    }
}
