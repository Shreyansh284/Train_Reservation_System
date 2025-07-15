using Application.Commands.BookingCommands;
using Application.DTOs.BookingDTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;
[ApiController]
[Route("api/")]
public class BookingController(ISender sender):ControllerBase
{
    [HttpPost("booking/train/{trainId}/user/{userId}")]

    public async Task<ActionResult<PassengerBookingInfoDTO>> BookPassenger(int trainId, int userId,BookingRequestDTO request)
    {
        return await sender.Send(new AddBookingCommand(trainId, userId, request));
    }

}