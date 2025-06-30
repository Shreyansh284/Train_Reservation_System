using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class Seat
{
    [Key]
    public int SeatId { get; set; }

    [ForeignKey("CoachId")]
    public int CoachId { get; set; }
    public Coach Coach { get; set; } = null!;

    [MaxLength(10)]
    public string SeatNumber { get; set; } = null!;
    // public SeatType SeatType { get; set; }
}