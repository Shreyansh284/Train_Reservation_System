using Core.Enums;

namespace Application.DTOs.BookingDTOs;

public class GetPassengerInfo
{
    public string Name { get; set; }
    public int Age { get; set; }
    public GenderType Gender { get; set; }
}