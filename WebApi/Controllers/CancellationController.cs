using Application.Commands.CancellationCommands;
using Application.DTOs.CancellationDTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;
[ApiController]
[Route("api/")]
public class CancellationController(ISender sender):ControllerBase
{
    [HttpPost("cancel-booking")]
    public async Task<IActionResult> CancelBooking(CancellationRequestDTO cancellationRequest)
    {
        await sender.Send(new BookingCancellationCommand(cancellationRequest));
        return Ok("Booking cancelled");
    }
}