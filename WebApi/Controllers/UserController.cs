using Application.Commands.UserCommand;
using Application.DTOs.UserDTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;
[ApiController]
[Route("api/")]
public class UserController(ISender sender):ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> AddUser([FromBody] UserRegisterationDTO userDto)
    {
        var user = await sender.Send(new AddUserCommand(userDto));
        return Ok(user);
    }
}