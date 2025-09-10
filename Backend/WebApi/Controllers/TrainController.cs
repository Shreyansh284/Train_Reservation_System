using Application.Commands.TrainCommands;
using Application.DTOs.TrainDTOs;
using Application.Queries.TrainQueries;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/")]
public class TrainController(ISender sender) : ControllerBase
{
    [HttpGet("trains")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllTrains()
    {
        var trains = await sender.Send(new GetAllTrainsQuery());
        return Ok(trains);
    }
    [Authorize(Roles = "Admin")]
    [HttpGet("trains/{trainId}")]
    public async Task<IActionResult> GetTrainById(int trainId)
    {
        var train = await sender.Send(new GetTrainByIdQuery(trainId));
        return Ok(train);
    }
    [Authorize(Roles = "Admin")]
    [HttpPost("trains")]
    public async Task<IActionResult> AddTrain([FromBody] CreateTrainDTO dto)
    {
        var result = await sender.Send(new AddTrainCommand(dto));
        return Ok(result);
    }
    [Authorize(Roles = "Admin")]
    [HttpPatch("trains/{trainId}/status")]
    public async Task<IActionResult> ToggleStatus(int trainId)
    {
        var trainStatus=await sender.Send(new ToggleTrainStatusCommand(trainId));
        if (trainStatus)
        {
            return Ok("Train Deactivated");
        }
        else
        {
            return Ok("Train Activated");
        }
    }
    [Authorize(Roles = "Admin")]
    [HttpPatch("trains/{trainId}")]
    public async Task<IActionResult> EditTrainDetails(int trainId, [FromBody] EditTrainDetailsDTO editDetails)
    {
        // var validator = _validatorFactory.GetValidator<EditTrainDetailsDTO>();
        // var result = await validator.ValidateAsync(editDetails);
        // if (!result.IsValid)
        //     return BadRequest(result.Errors);

        var train = await sender.Send(new EditTrainDetailsCommand(trainId, editDetails));
        return Ok(train);

    }
    [Authorize(Roles = "Admin")]
    [HttpPatch("trains/{trainId}/stations/{stationId}")]
    public async Task<IActionResult> EditTrainStation(int trainId, int stationId, EditTrainStationDTO editTrainStation)
    {
        var train = await sender.Send(new EditTrainStationCommand(trainId, stationId, editTrainStation));
        return Ok(train);
    }
    [Authorize(Roles = "Admin")]
    [HttpPatch("trains/{trainId}/coaches/{coachId}/status")]
    public async Task<IActionResult> ToggleTrainCoach(int trainId, int coachId)
    {
        var coachStatus=await sender.Send(new ToggleTrainCoachCommand(trainId, coachId));
        if (coachStatus)
        {
            return Ok("Train Coach Activated");
        }
        else
        {
            return Ok("Train Coach Deactivated");
        }

    }

    [HttpGet("trains/search")]
    public async Task<IActionResult> SearchTrain([FromQuery]SearchTrainRequestDTO request)
    {
        var trainDetails = await sender.Send(new GetAvailableTrainsForSearchRequestQuery(request));
        if (trainDetails.Count == 0)
        {
            return NotFound("Trains not found");
        }
        return Ok(trainDetails);
    }

    [HttpGet("trains/{trainId}/search")]
    public async Task<IActionResult> GetTrainDetailBySearchRequest(int trainId,
        [FromQuery] SearchTrainRequestDTO search)
    {
        var trainDetails = await sender.Send(new GetTrainDetailsBySearchRequest(trainId,search));
        return Ok(trainDetails);
    }
}