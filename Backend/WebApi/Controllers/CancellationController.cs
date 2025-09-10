using Application.Commands.CancellationCommands;
using Application.DTOs.CancellationDTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;
[ApiController]
[Route("api/")]
public class CancellationController(ISender sender):ControllerBase
{
    [Authorize]
    [HttpPost("cancelbooking")]
    public async Task<IActionResult> CancelBooking(CancellationRequestDTO cancellationRequest)
    {
        await sender.Send(new BookingCancellationCommand(cancellationRequest));
        return Ok("Booking cancelled");
    }
}