using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Commands.StationCommands;
using Application.DTOs.StationDTOs;
using AutoFixture;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using WebApi.Controllers;
using Xunit;

namespace WebApi.Tests.Controllers
{
    public class StationControllerTests
    {
        private readonly Mock<ISender> _senderMock;
        private readonly StationController _controller;
        private readonly IFixture _fixture;

        public StationControllerTests()
        {
            _fixture = new Fixture();
            _senderMock = new Mock<ISender>();
            _controller = new StationController(_senderMock.Object);
        }

        [Fact]
        public async Task GetStationsByQueryAsync_WithValidQuery_ShouldReturnOkResult()
        {
            // Arrange
            var query = "Delhi";
            var expectedStations = _fixture.CreateMany<DisplayStationDTO>(3).ToList();
            
            _senderMock.Setup(x => x.Send(
                It.Is<GetStationCommand>(cmd => cmd.query == query),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedStations);

            // Act
            var result = await _controller.GetStationsByQueryAsync(query);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var stations = Assert.IsAssignableFrom<List<DisplayStationDTO>>(okResult.Value);
            Assert.Equal(expectedStations.Count, stations.Count);
            
            _senderMock.Verify(
                x => x.Send(
                    It.Is<GetStationCommand>(cmd => cmd.query == query),
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public async Task GetStationsByQueryAsync_WithEmptyQuery_ShouldReturnBadRequest(string query)
        {
            // Act
            var result = await _controller.GetStationsByQueryAsync(query);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Station query is empty", badRequestResult.Value);
            
            // Verify mediator was not called
            _senderMock.Verify(
                x => x.Send(It.IsAny<GetStationCommand>(), It.IsAny<CancellationToken>()),
                Times.Never);
        }
    }
}
