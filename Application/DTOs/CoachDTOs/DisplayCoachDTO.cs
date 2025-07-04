namespace Application.DTOs.CoachDTOs;

public class DisplayCoachDTO
{
    public int CoachId { get; set; }
    public string CoachNumber { get; set; } = null!;
    public string CoachClass { get; set; } = null!;
    public int TotalSeats { get; set; }
}