using Core.Enums;

namespace Application.DTOs.CoachDTOs;

public class CreateCoachDTO
{

    public string CoachNumber { get; set; } = null!;
    public CoachClass CoachClass { get; set; }
    public int TotalSeats { get; set; }
}