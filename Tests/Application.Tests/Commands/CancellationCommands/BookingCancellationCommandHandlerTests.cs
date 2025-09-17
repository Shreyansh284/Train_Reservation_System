using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using Application.Commands.CancellationCommands;
using Application.DTOs.CancellationDTOs;
using Application.Exceptions;
using Application.Common.Interfaces;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Moq;
using Xunit;

namespace Application.Tests.Commands.CancellationCommands
{


    public class BookingCancellationCommandHandlerTests
    {
        private readonly Mock<IBookingRepository> bookingRepo = new();
        private readonly Mock<IPassengerRepository> passengerRepo = new();
        private readonly Mock<ICancellationRepository> cancellationRepo = new();
        private readonly Mock<IWaitingRepository> waitingRepo = new();
        private readonly Mock<ITrainScheduleRepository> scheduleRepo = new();
        private readonly Mock<ICurrentUserService> currentUser = new();
        private readonly Mock<IEmailNotificationService> emailService = new();
        private readonly Mock<IUnitOfWork> unitOfWork = new();


        private BookingCancellationCommandHandler CreateHandler()
        {
            return new BookingCancellationCommandHandler(
                bookingRepo.Object,
                passengerRepo.Object,
                cancellationRepo.Object,
                waitingRepo.Object,
                scheduleRepo.Object,
                currentUser.Object,
                emailService.Object,
                unitOfWork.Object
            );
        }

        [Fact]
        public async Task Handle_ShouldThrow_WhenUserNotAuthenticated()
        {
            // Arrange
            var handler = CreateHandler();
            currentUser.Setup(x => x.UserId).Returns((int?)null);
            var command = new BookingCancellationCommand(new CancellationRequestDTO { PNR = 1000005 });

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(command, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_ShouldThrow_WhenBookingNotFound()
        {
            // Arrange
            var handler = CreateHandler();
            currentUser.Setup(x => x.UserId).Returns(1);
            bookingRepo.Setup(x => x.GetBookingWithDetailsByPNR(1000005)).ReturnsAsync((Booking)null);

            var command = new BookingCancellationCommand(new CancellationRequestDTO { PNR = 1000005 });

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_ShouldCancelPassenger_AndSendEmail()
        {
            // Arrange
            var booking = new Booking
            {
                BookingId = 1,
                UserId = 1,
                TotalFare = 200,
                Passengers = new List<Passenger>
            {
                new Passenger { PassengerId = 10, Status = BookingStatus.Confirmed }
            }
            };

            var handler = CreateHandler();
            currentUser.Setup(x => x.UserId).Returns(1);
            bookingRepo.Setup(x => x.GetBookingWithDetailsByPNR(1000005)).ReturnsAsync(booking);

            var command = new BookingCancellationCommand(new CancellationRequestDTO
            {
                PNR = 1000005,
                PassengerIds = new List<int> { 10 },
                Reason = "Test"
            });

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.Equal(BookingStatus.Cancelled, booking.Passengers.ElementAt(0).Status);
            cancellationRepo.Verify(x => x.AddCancellation(It.IsAny<Cancellation>()), Times.Once);
            emailService.Verify(x => x.SendBookingCancellationAsync(booking, It.IsAny<List<Passenger>>(), 200), Times.Once);
        }

        [Fact]
        public async Task Handle_ShouldPromoteWaitlist_WhenNoOverlap()
        {
            // Arrange
            var cancelledPassenger = new Passenger
            {
                PassengerId = 1,
                Status = BookingStatus.Confirmed,
                SeatId = 5,
                CoachClass = CoachClass.SL,
                Booking = new Booking
                {
                    BookingId = 1,
                    UserId = 1,
                    TotalFare = 200,
                    JourneyDate = DateTime.Today,
                    TrainId = 100,
                    Passengers = new List<Passenger>()
                },
                Seat = new Seat { CoachId = 20 }
            };

            cancelledPassenger.Booking.Passengers.Add(cancelledPassenger);

            var handler = CreateHandler();
            currentUser.Setup(x => x.UserId).Returns(1);
            bookingRepo.Setup(x => x.GetBookingWithDetailsByPNR(1000005))
                .ReturnsAsync(cancelledPassenger.Booking);

            waitingRepo.Setup(x => x.GetWaitlistedPassengerOfTrainByCoachClassAndDate(100, It.IsAny<DateTime>(), "SL"))
                .ReturnsAsync(new List<TrainWaitlist> { new TrainWaitlist { PassengerId = 99, Status = BookingStatus.Waiting, Booking = new Booking { FromStationId = 1, ToStationId = 2 } } });

            passengerRepo.Setup(x => x.GetPassengerById(99))
                .ReturnsAsync(new Passenger { PassengerId = 99, Status = BookingStatus.Waiting });

            scheduleRepo.Setup(x => x.GetTrainSchedulesByCoachIdAsync(20))
                .ReturnsAsync(new List<TrainSchedule>
                {
                new TrainSchedule { StationId = 1, DistanceFromSource = 0 },
                new TrainSchedule { StationId = 2, DistanceFromSource = 10 }
                });

            var command = new BookingCancellationCommand(new CancellationRequestDTO
            {
                PNR = 1000005,
                PassengerIds = new List<int> { 1 },
                Reason = "Cancel"
            });

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            passengerRepo.Verify(x => x.GetPassengerById(99), Times.Once);
            emailService.Verify(x => x.SendWaitlistPromotionEmailAsync(It.IsAny<Passenger>()), Times.Once);
        }
        [Fact]
        public async Task ShouldNotPromote_WhenWaitlistCoversCancelledAndAnotherConfirmedOverlap()
        {
            // Arrange
            var coachId = 5;
            var seatId = 10;

            // Passenger P1: Confirmed, 1 → 3
            var confirmedP1 = new Passenger
            {
                PassengerId = 201,
                SeatId = seatId,
                Status = BookingStatus.Confirmed,
                Booking = new Booking { FromStationId = 1, ToStationId = 3 }
            };

            // Passenger P2: Confirmed, 3 → 6 (will be cancelled)
            var cancelledP2 = new Passenger
            {
                PassengerId = 202,
                SeatId = seatId,
                Status = BookingStatus.Confirmed,
                Booking = new Booking { FromStationId = 3, ToStationId = 6, TrainId = 1 },
                Seat = new Seat { CoachId = coachId }
            };

            // Waitlisted P3: Wants full journey 1 → 6
            var waitlistedP3 = new TrainWaitlist
            {
                PassengerId = 203,
                Status = BookingStatus.Waiting,
                Booking = new Booking { FromStationId = 1, ToStationId = 6, TrainId = 1 }
            };

            // Train schedule distances
            scheduleRepo.Setup(r => r.GetTrainSchedulesByCoachIdAsync(coachId))
                .ReturnsAsync(new List<TrainSchedule>
                {
            new() { StationId = 1, DistanceFromSource = 0 },
            new() { StationId = 3, DistanceFromSource = 30 },
            new() { StationId = 6, DistanceFromSource = 60 }
                });

            // Repo returns waitlist with P3
            waitingRepo.Setup(r => r.GetWaitlistedPassengerOfTrainByCoachClassAndDate(
                    It.IsAny<int>(), It.IsAny<DateTime>(), It.IsAny<string>()))
                .ReturnsAsync(new List<TrainWaitlist> { waitlistedP3 });

            passengerRepo.Setup(r => r.GetPassengerById(waitlistedP3.PassengerId))
                .ReturnsAsync(new Passenger { PassengerId = 203 });

            var handler = new BookingCancellationCommandHandler(
                bookingRepo.Object, passengerRepo.Object, cancellationRepo.Object,
                waitingRepo.Object, scheduleRepo.Object,
                currentUser.Object, emailService.Object, unitOfWork.Object);

            // Act → cancel P2
            cancelledP2.Booking.Passengers = new List<Passenger> { confirmedP1, cancelledP2 };
            await handler.TryPromoteWaitlistedPassengersAsync(new List<Passenger> { cancelledP2 });

            // Assert → Waitlisted P3 should NOT be promoted due to overlap with P1
            Assert.Equal(BookingStatus.Waiting, waitlistedP3.Status);
        }

    }

}
