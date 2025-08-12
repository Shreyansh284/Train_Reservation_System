using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class Train
{

    [Key]
    public int TrainId { get; set; }

    [MaxLength(10)]
    public string TrainNumber { get; set; }= null!;

    [MaxLength(200)]
    public string TrainName { get; set; }= null!;

    [ForeignKey("SourceStation")]
    public int SourceStationId { get; set; }
    public Station SourceStation { get; set; }= null!;

    [ForeignKey("DestinationStation")]
    public int DestinationStationId { get; set; }
    public Station DestinationStation { get; set; }= null!;

    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; } =true;

    public ICollection<Coach> Coaches { get; set; }= null!;
    public ICollection<TrainSchedule> Schedules { get; set; }= null!;
}