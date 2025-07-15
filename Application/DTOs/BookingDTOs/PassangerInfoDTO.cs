using Core.Enums;

namespace Application.DTOs.BookingDTOs;

public class PassangerInfoDTO
{
    public string Name { get; set; } = null!;
    public int Age { get; set; }
    public GenderType Gender { get; set; }
}