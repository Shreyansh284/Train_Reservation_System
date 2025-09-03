using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Commands.BookingCommands;
using Application.DTOs.BookingDTOs;
using Application.Queries.BookingQueries;
using AutoFixture;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using WebApi.Controllers;
using Xunit;

namespace WebApi.Tests.Controllers
{
    public class BookingControllerTests
    {
        private readonly Mock<ISender> _senderMock;
        private readonly BookingController _controller;
        private readonly IFixture _fixture;
            
        public BookingControllerTests()
        {
            _fixture = new Fixture();
            _senderMock = new Mock<ISender>();
            _controller = new BookingController(_senderMock.Object);
        }

        [Fact]
        public async Task GetAllBookings_ShouldReturnOkResult_WithBookings()
        {
            // Arrange
            var expectedBookings = _fixture.CreateMany<PassengerBookingInfoDTO>(3).ToList();
            _senderMock.Setup(x => x.Send(It.IsAny<GetAllBookingsQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedBookings);

            // Act
            var result = await _controller.GetAllBookings();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var bookings = Assert.IsAssignableFrom<List<PassengerBookingInfoDTO>>(okResult.Value);
            Assert.Equal(expectedBookings.Count, bookings.Count);
        }

        [Fact]
        public async Task Booking_ShouldReturnOkResult_WithBookingDetails()
        {
            // Arrange
            var trainId = _fixture.Create<int>();
            var userId = _fixture.Create<int>();
            var request = _fixture.Create<BookingRequestDTO>();
            var expectedDetails = _fixture.Create<PassengerBookingInfoDTO>();

            _senderMock.Setup(x => x.Send(It.Is<AddBookingCommand>(c => 
                c.TrainId == trainId && 
                c.UserId == userId && 
                c.BookingRequest == request), It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedDetails);

            // Act
            var result = await _controller.Booking(trainId, userId, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var bookingDetails = Assert.IsType<PassengerBookingInfoDTO>(okResult.Value);
            Assert.Equal(expectedDetails, bookingDetails);
        }

        [Fact]
        public async Task GetBooking_WithValidPnr_ShouldReturnOkResult_WithBooking()
        {
            // Arrange
            var pnr = _fixture.Create<long>();
            var expectedBooking = _fixture.Create<PassengerBookingInfoDTO>();

            _senderMock.Setup(x => x.Send(It.Is<GetTicketByPNRQuery>(q => 
                q.pnr == pnr), It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedBooking);

            // Act
            var result = await _controller.GetBooking(pnr);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var booking = Assert.IsType<PassengerBookingInfoDTO>(okResult.Value);
            Assert.Equal(expectedBooking, booking);
        }

        [Fact]
        public async Task GetBooking_WithInvalidPnr_ShouldReturnNotFoundResult()
        {
            // Arrange
            var pnr = _fixture.Create<long>();

            _senderMock.Setup(x => x.Send(It.Is<GetTicketByPNRQuery>(q => 
                q.pnr == pnr), It.IsAny<CancellationToken>()))
                .ReturnsAsync((PassengerBookingInfoDTO)null);

            // Act
            var result = await _controller.GetBooking(pnr);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Booking not found", notFoundResult.Value);
        }
    }
}
