using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Commands.BookingCommands;
using Application.Commands.CancellationCommands;
using Application.DTOs.BookingDTOs;
using Application.DTOs.CancellationDTOs;
using AutoFixture;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using WebApi.Controllers;
using Xunit;

namespace WebApi.Tests.Controllers
{
    public class CancellationControllerTests
    {
        private readonly Mock<ISender> _senderMock;
        private readonly CancellationController _controller;
        private readonly IFixture _fixture;

        public CancellationControllerTests()
        {
            _fixture = new Fixture();
            _senderMock = new Mock<ISender>();
            _controller = new CancellationController(_senderMock.Object);
        }

        [Fact]
        public async Task CancelBooking_ShouldReturnOkResult_WhenCancellationSucceeds()
        {
            // Arrange
            var cancellationRequest = _fixture.Create<CancellationRequestDTO>();
            
            _senderMock
                .Setup(x => x.Send(It.Is<BookingCancellationCommand>(cmd => 
                    cmd.cancellationRequest == cancellationRequest), 
                    It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.CancelBooking(cancellationRequest);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Booking cancelled", okResult.Value);
            
            // Verify the command was sent with correct parameters
            _senderMock.Verify(
                x => x.Send(
                    It.Is<BookingCancellationCommand>(cmd => cmd.cancellationRequest == cancellationRequest),
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }
    }
}   
