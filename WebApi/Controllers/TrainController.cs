using Application.Commands.TrainCommands;
using Application.DTOs.TrainDTOs;
using Application.Queries.TrainQueries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class TrainController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllTrains()
    {
        var trains = await sender.Send(new GetAllTrainsQuery());
        return Ok(trains);
    }

    [HttpGet("{trainNumber}")]
    public async Task<IActionResult> GetTrainByNumber(string trainNumber)
    {
        var train = await sender.Send(new GetTrainByNumberQuery(trainNumber));
        return Ok(train);
    }
    [HttpPost]
    public async Task<IActionResult> AddTrain([FromBody] CreateTrainDTO dto)
    {
        var result = await sender.Send(new AddTrainCommand(dto));
        return Ok(result);
    }

    [HttpDelete("{trainNumber}")]
    public async Task<IActionResult> DeleteTrain(string trainNumber)
    {
        await sender.Send(new DeleteTrainCommand(trainNumber));
        return Ok("Train deleted");
    }
}