using Application.Commands.UserCommand;
using Application.DTOs.UserDTOs;
using Application.Queries.UserQueries;
using Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/")]
public class AuthController(IAuthService authService, ISender sender) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterationDTO userDto)
    {
        var user = await sender.Send(new AddUserCommand(userDto));
        return Ok(user);
    }
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginUserDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.UserName) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest("Username and password required");

        var token = await authService.AuthenticateAsync(dto.UserName, dto.Password);
        if (token is null) return Unauthorized("Invalid credentials");
        return Ok(new { token });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserResponseDto>> GetCurrentUser()
    {
        var query = new GetCurrentUserQuery();
        var user = await sender.Send(query);
        return Ok(user);
    }


}