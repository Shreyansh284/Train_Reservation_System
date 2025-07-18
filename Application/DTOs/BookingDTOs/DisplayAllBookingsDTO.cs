namespace Application.DTOs.BookingDTOs;

public class DisplayAllBookingsDTO
{
    public long PNR { get; set; }
    public List<PassengerBookingInfoDTO> Passengers { get; set; } = null!;
}