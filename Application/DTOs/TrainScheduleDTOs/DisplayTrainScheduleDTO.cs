using Application.DTOs.StationDTOs;

namespace Application.DTOs.TrainScheduleDTOs;

public class DisplayTrainScheduleDTO
{
    public int ScheduleId { get; set; }
    public DisplayStationDTO Station { get; set; } = null!;
    public int DistanceFromSource { get; set; }
}