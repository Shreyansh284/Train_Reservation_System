namespace Application.DTOs.CoachDTOs;

public class CoachAvailabilityDTO
{
    public string CoachType { get; set; }
    public int TotalSeats { get; set; }
    public int AvailableSeats { get; set; }
}