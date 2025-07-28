using Core.Enums;

namespace Application.DTOs.BookingDTOs;

public class BookingRequestDTO
{
    public int FromStationId { get; set; }
    public int ToStationId{ get; set; }
    public DateTime JourneyDate{ get; set; }
    public string CoachClass{ get; set; }
    public decimal TotalFare{ get; set; }
    public List<GetPassengerInfo> Passangers{ get; set; }
}