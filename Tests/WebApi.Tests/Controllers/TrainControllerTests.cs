using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Commands.TrainCommands;
using Application.DTOs.TrainDTOs;
using Application.Exceptions;
using Application.Queries.TrainQueries;
using AutoFixture;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Moq;
using WebApi.Controllers;
using Xunit;

namespace WebApi.Tests.Controllers
{
    public class TrainControllerTests
    {
        private readonly Mock<ISender> _senderMock;
        private readonly TrainController _controller;
        private readonly IFixture _fixture;

        public TrainControllerTests()
        {
            _fixture = new Fixture();
            _senderMock = new Mock<ISender>();
            _controller = new TrainController(_senderMock.Object);
        }

        [Fact]
        public async Task GetAllTrains_ReturnsOkWithTrains()
        {
            //Arrange
            var trains = _fixture.Create<List<DisplayTrainDTO>>();
            _senderMock.Setup(s => s.Send(It.IsAny<GetAllTrainsQuery>(), It.IsAny<CancellationToken>())).ReturnsAsync(trains);
            //Act
            var result = await _controller.GetAllTrains();
            //Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(trains);
        }

        [Fact]
        public async Task GetTrainByNumber_ReturnsOkWithTrain()
        {
            var train = _fixture.Create<DisplayTrainDTO>();
            int trainId =_fixture.Create<int>();
            _senderMock.Setup(s => s.Send(It.Is<GetTrainByNumberQuery>(q => q.trainId == trainId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(train);

            var result = await _controller.GetTrainByNumber(trainId);

            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(train);
        }

        [Fact]
        public async Task AddTrain_ReturnsOkResult_WhenSuccessful()
        {
            // Arrange
            var trainDto = _fixture.Create<CreateTrainDTO>();
            var createdTrain = _fixture.Create<DisplayTrainDTO>();
            _senderMock.Setup(s => s.Send(It.IsAny<AddTrainCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(createdTrain);
    
            // Act
            var result = await _controller.AddTrain(trainDto);
    
            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(createdTrain);
        }

        [Fact]
        public async Task ToggleStatus_ReturnsOkWithDeactivatedMessage_WhenTrainIsActive()
        {
            // Arrange
            var trainId = _fixture.Create<int>();
            _senderMock.Setup(s => s.Send(It.Is<ToggleTrainStatusCommand>(c => c.TrainId == trainId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(true); // true means deactivated
    
            // Act
            var result = await _controller.ToggleStatus(trainId);
    
            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().Be("Train Deactivated");
        }

        [Fact]
        public async Task ToggleStatus_ReturnsOkWithActivatedMessage_WhenTrainIsInactive()
        {
            // Arrange
            var trainId = _fixture.Create<int>();
            _senderMock.Setup(s => s.Send(It.Is<ToggleTrainStatusCommand>(c => c.TrainId == trainId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(false); // false means activated
    
            // Act
            var result = await _controller.ToggleStatus(trainId);
    
            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().Be("Train Activated");
        }

        [Fact]
        public async Task EditTrainDetails_ReturnsOk_WhenSuccessful()
        {
            // Arrange
            var trainId = _fixture.Create<int>();
            var editDetails = _fixture.Create<EditTrainDetailsDTO>();
            var updatedTrain = _fixture.Create<DisplayTrainDTO>();
            _senderMock.Setup(s => s.Send(It.IsAny<EditTrainDetailsCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(updatedTrain);
    
            // Act
            var result = await _controller.EditTrainDetails(trainId, editDetails);
    
            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(updatedTrain);
        }

        [Fact]
        public async Task EditTrainStation_ReturnsOk_WhenSuccessful()
        {
            // Arrange
            var trainId = _fixture.Create<int>();
            var stationId = _fixture.Create<int>();
            var editTrainStation = _fixture.Create<EditTrainStationDTO>();
            var updatedTrain = _fixture.Create<DisplayTrainDTO>();
            _senderMock.Setup(s => s.Send(It.IsAny<EditTrainStationCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(updatedTrain);
    
            // Act
            var result = await _controller.EditTrainStation(trainId, stationId, editTrainStation);
    
            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(updatedTrain);
        }

        [Fact]
        public async Task ToggleTrainCoach_ReturnsOkWithActivatedMessage_WhenCoachActivated()
        {
            // Arrange
            var trainId = _fixture.Create<int>();
            var coachId = _fixture.Create<int>();
                _senderMock.Setup(s => s.Send(It.IsAny<ToggleTrainCoachCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(true); // true means coach is activated
    
            // Act
            var result = await _controller.ToggleTrainCoach(trainId, coachId);
    
            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().Be("Train Coach Activated");
        }

        [Fact]
        public async Task ToggleTrainCoach_ReturnsOkWithDeactivatedMessage_WhenCoachDeactivated()
        {
            // Arrange
            var trainId = _fixture.Create<int>();
            var coachId = _fixture.Create<int>();
            _senderMock.Setup(s => s.Send(It.IsAny<ToggleTrainCoachCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(false); // false means coach is deactivated
    
            // Act
            var result = await _controller.ToggleTrainCoach(trainId, coachId);
    
            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().Be("Train Coach Deactivated");
        }

        [Fact]
        public async Task SearchTrain_ReturnsOk_WhenTrainsFound()
        {
            // Arrange
            var searchRequest = _fixture.Create<SearchTrainRequestDTO>();
            var trainSearchResults = _fixture.Create<List<TrainAvailabilityDTO>>(); // Using object as we don't know the exact return type
            _senderMock.Setup(s => s.Send(It.IsAny<GetAvailableTrainsForSearchRequestQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(trainSearchResults);
    
            // Act
            var result = await _controller.SearchTrain(searchRequest);
    
            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(trainSearchResults);
        }

        [Fact]
        public async Task SearchTrain_ReturnsNotFound_WhenNoTrainsFound()
        {
            // Arrange
            var searchRequest = _fixture.Create<SearchTrainRequestDTO>();
            var emptyList = new List<TrainAvailabilityDTO>(); // Using object as we don't know the exact return type
            _senderMock.Setup(s => s.Send(It.IsAny<GetAvailableTrainsForSearchRequestQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(emptyList);
    
            // Act
            var result = await _controller.SearchTrain(searchRequest);
    
            // Assert
            result.Should().BeOfType<NotFoundObjectResult>();
            var notFoundResult = result as NotFoundObjectResult;
            notFoundResult!.Value.Should().Be("Trains not found");
        }

        [Fact]
        public async Task GetTrainDetailBySearchRequest_ReturnsOk_WhenTrainFound()
        {
            // Arrange
            var trainId = _fixture.Create<int>();
            var searchRequest = _fixture.Create<SearchTrainRequestDTO>();
            var trainDetail = _fixture.Create<TrainAvailabilityDTO>(); // Using object as we don't know the exact return type
            _senderMock.Setup(s => s.Send(It.IsAny<GetTrainDetailsBySearchRequest>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(trainDetail);
    
            // Act
            var result = await _controller.GetTrainDetailBySearchRequest(trainId, searchRequest);
    
            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().Be(trainDetail);
        }

        [Fact]
        public async Task GetAllTrains_ReturnsOkWithEmptyList_WhenNoTrainsExist()
        {
            // Arrange
            var emptyList = new List<DisplayTrainDTO>();
            _senderMock.Setup(s => s.Send(It.IsAny<GetAllTrainsQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(emptyList);
    
            // Act
            var result = await _controller.GetAllTrains();
    
            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(emptyList);
        }

        [Fact]
        public async Task GetTrainByNumber_WhenTrainExists_ReturnsOkResult()
        {
            // Arrange
            var trainId = _fixture.Create<int>();
            var train = _fixture.Create<DisplayTrainDTO>();
            _senderMock.Setup(s => s.Send(It.IsAny<GetTrainByNumberQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(train);
    
            // Act
            var result = await _controller.GetTrainByNumber(trainId);
    
            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(train);
        }
    }
    }
