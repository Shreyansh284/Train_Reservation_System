using Core.Enums;

namespace Application.DTOs.BookingDTOs;

public class DisplayPassengerInfoDTO
{
    public string Name { get; set; }
    public int Age { get; set; }
    public GenderType Gender { get; set; }
    public string SeatNumber { get; set; }
    public string CoachNumber { get; set; }
    public string CoachType { get; set; }
    public string BookingStatus { get; set; }
}