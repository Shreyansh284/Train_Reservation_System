using Application.Commands.StationCommands;
using Application.DTOs.StationDTOs;
using Core.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;
[ApiController]
[Route("api/")]
public class StationController(ISender sender):ControllerBase
{
    // public async
    [HttpGet("stations/search")]
    public async Task<IActionResult> GetStationsByQueryAsync([FromQuery]string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest("Station query is empty");
        var stations = await sender.Send(new GetStationCommand(query));
        return Ok(stations);
    }
}