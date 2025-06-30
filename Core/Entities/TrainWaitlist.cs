using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Enums;

namespace Core.Entities;

public class TrainWaitlist
{
    [Key]
    public int WaitlistId { get; set; }

    public int TrainId { get; set; }
    public Train Train { get; set; } = null!;

    public DateTime JourneyDate { get; set; }
    public CoachClass CoachClass { get; set; }

    [ForeignKey("FromStationId")]
    public int FromStationId { get; set; }
    public Station FromStation { get; set; } = null!;

    [ForeignKey("ToStationId")]
    public int ToStationId { get; set; }
    public Station ToStation { get; set; } = null!;

    [ForeignKey("PassengerId")]
    public int PassengerId { get; set; }
    public Passenger Passenger { get; set; } = null!;

    public int BookingId { get; set; }
    public Booking Booking { get; set; } = null!;

    public int Position { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Waiting;
    public DateTime AddedOn { get; set; } = DateTime.Now;
}