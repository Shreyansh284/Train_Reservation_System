using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.UserDTOs;

public class UserRegisterationDTO
{
    [MaxLength(200)]
    public string FullName { get; set; } = null!;

    [MaxLength(200),EmailAddress]
    public string Email { get; set; } = null!;

    [MaxLength(10),MinLength(10)]
    public string Mobile { get; set; } = null!;

    [MaxLength(256)]
    public string Password { get; set; } = null!;
    [Compare("Password")]
    public string ConfirmPassword { get; set; } = null!;
}