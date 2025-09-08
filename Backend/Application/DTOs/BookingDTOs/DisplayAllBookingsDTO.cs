namespace Application.DTOs.BookingDTOs;

public class DisplayAllBookingsDTO
{
    public long PNR { get; set; }
    public string TrainName { get; set; }
    public string TrainNumber { get; set; }
    public string UserEmail { get; set; }
    public string UserName { get; set; }
    public string Source { get; set; }
    public string Destination { get; set; }
    public DateTime JourneyDate { get; set; }
    public decimal TotalFare { get; set; }
    public int TotalSeats { get; set; }
    public int ConfirmedSeats { get; set; }
    public int WaitingSeats { get; set; }
    public int CancelledSeats { get; set; }
}