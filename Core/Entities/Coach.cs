using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Enums;

namespace Core.Entities;

public class Coach
{
    [Key]
    public int CoachId { get; set; }
    [ForeignKey("TrainId")]
    public int TrainId { get; set; }
    public Train Train { get; set; } = null!;

    [MaxLength(10)]
    public string CoachNumber { get; set; } = null!;
    public CoachClass CoachClass { get; set; }
    public int TotalSeats { get; set; }

    public ICollection<Seat> Seats { get; set; } = null!;
}