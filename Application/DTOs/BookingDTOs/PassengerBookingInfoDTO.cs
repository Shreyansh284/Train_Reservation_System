namespace Application.DTOs.BookingDTOs;

public class PassengerBookingInfoDTO
{
    public string PNR { get; set; }
    public string TrainName { get; set; }
    public string FromStation { get; set; }
    public string ToStation { get; set; }
    public DateTime JourneyDate { get; set; }
    public List<PassengerInfoDTO> Passengers { get; set; }
}

public class PassengerInfoDTO
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string Gender { get; set; }
    public string SeatNumber { get; set; }
    public string CoachNumber { get; set; }
    public string CoachType { get; set; }
}