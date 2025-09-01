using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Moq;
using AutoFixture;
using FluentAssertions;
using WebApi.Controllers;
using Application.Queries.TrainQueries;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using Application.DTOs.TrainDTOs;

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
    }
    }
