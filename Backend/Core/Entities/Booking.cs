using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Enums;

namespace Core.Entities;

public class Booking
{
    [Key]
    public int BookingId { get; set; }

    public long PNR { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int TrainId { get; set; }
    public Train Train { get; set; } = null!;

    public DateTime JourneyDate { get; set; }

    public int FromStationId { get; set; }
    public Station FromStation { get; set; } = null!;

    public int ToStationId { get; set; }
    public Station ToStation { get; set; } = null!;

    public decimal TotalFare { get; set; }
    public BookingStatus BookingStatus { get; set; } = BookingStatus.RAC;
    public DateTime BookedOn { get; set; } = DateTime.Now;

    public ICollection<Passenger> Passengers { get; set; } =null!;
    public ICollection<Cancellation>? Cancellations { get; set; }
}