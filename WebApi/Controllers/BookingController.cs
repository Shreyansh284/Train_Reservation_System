using Application.Commands.BookingCommands;
using Application.DTOs.BookingDTOs;
using Application.Queries.BookingQueries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;
[ApiController]
[Route("api/")]
public class BookingController(ISender sender):ControllerBase
{
    [Authorize(Roles = "Admin")]
    [HttpGet("bookings")]
    public async Task<IActionResult> GetAllBookings()
    {
        var bookings = await sender.Send(new GetAllBookingsQuery());
        return Ok(bookings);
    }
    [Authorize]
    [HttpPost("booking/train/{trainId}/user/{userId}")]
    public async Task<IActionResult> Booking(int trainId, int userId,BookingRequestDTO request)
    {
        var bookingDetails=await sender.Send(new AddBookingCommand(trainId, userId, request));
        return Ok(bookingDetails);
    }
    [Authorize]
    [HttpGet("booking/{pnr}")]
    public async Task<IActionResult> GetBooking(long pnr)
    {
        var booking = await sender.Send(new GetTicketByPNRQuery(pnr));
        if (booking == null)
        {
            return NotFound("Booking not found");
        }
        return Ok(booking);
    }


}