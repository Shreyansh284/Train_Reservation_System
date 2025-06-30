using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class TrainSchedule
{

    [Key]
    public int ScheduleId { get; set; }

    [ForeignKey("TrainId")]
    public int TrainId { get; set; }
    public Train Train { get; set; } = null!;

    [ForeignKey("StationId")]
    public int StationId { get; set; }
    public Station Station { get; set; } = null!;

    public TimeSpan? ArrivalTime { get; set; }
    public TimeSpan? DepartureTime { get; set; }
    public int? DayNumber { get; set; }
    public int DistanceFromSource { get; set; }
    public int StationOrder { get; set; }
}