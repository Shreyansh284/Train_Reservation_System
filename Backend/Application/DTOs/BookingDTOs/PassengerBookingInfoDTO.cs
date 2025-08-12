namespace Application.DTOs.BookingDTOs;

public class PassengerBookingInfoDTO
{
    public string PNR { get; set; }
    public string TrainName { get; set; }
    public string FromStation { get; set; }
    public string ToStation { get; set; }
    public DateTime JourneyDate { get; set; }

    public decimal TotalFare {get;set;}
    public List<DisplayPassengerInfoDTO> Passengers { get; set; }
}