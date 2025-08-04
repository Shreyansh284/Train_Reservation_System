namespace Application.DTOs.UserDTOs;

public class UserResponseDto
{
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string UserRole { get; set; } = string.Empty;
}