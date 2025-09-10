using Application.DTOs.CoachDTOs;
using Application.DTOs.StationDTOs;
using Application.DTOs.TrainScheduleDTOs;

namespace Application.DTOs.TrainDTOs;

public class DisplayTrainDTO
{
    public int TrainId { get; set; }
    public string TrainNumber { get; set; } = null!;
    public string TrainName { get; set; } = null!;

    public bool IsActive { get; set; } = true;
    public DisplayStationDTO SourceStation { get; set; } = null!;
    public DisplayStationDTO DestinationStation { get; set; } = null!;

    public List<DisplayCoachDTO> Coaches { get; set; } = new();
    public List<DisplayTrainScheduleDTO> Schedules { get; set; } = new();
}