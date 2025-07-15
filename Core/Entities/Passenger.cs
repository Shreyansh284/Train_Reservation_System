using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Enums;

namespace Core.Entities;

public class Passenger
{
    [Key]
    public int PassengerId { get; set; }

    [ForeignKey("BookingId")]
    public int BookingId { get; set; }
    public Booking Booking { get; set; } = null!;

    [MaxLength(100)]
    public string Name { get; set; } = null!;
    public int Age { get; set; }
    public GenderType Gender { get; set; }

    public int CoachId { get; set; }
    public Coach Coach { get; set; } = null!;

    [ForeignKey("SeatId")]
    public int SeatId { get; set; }
    public Seat Seat { get; set; } = null!;

    public BookingStatus Status { get; set; } = BookingStatus.Waiting;
}