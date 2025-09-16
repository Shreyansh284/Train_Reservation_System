namespace Application.DTOs.BookingDTOs;

public class PassengerBookingInfoDTO
{
    public string PNR { get; set; }= null!;
    public string TrainName { get; set; }= null!;
    public string FromStation { get; set; }= null!;
    public string ToStation { get; set; }= null!;
    public DateTime JourneyDate { get; set; }= DateTime.Now;

    public decimal TotalFare {get;set;}= 0;
    public List<DisplayPassengerInfoDTO> Passengers { get; set; }= new();
}