using Application.DTOs.CoachDTOs;
using Application.DTOs.StationDTOs;
using Application.DTOs.TrainScheduleDTOs;

namespace Application.DTOs.TrainDTOs;

public class TrainAvailabilityDTO
{
    public int TrainId { get; set; }
    public string TrainNumber { get; set; }
    public string TrainName { get; set; }
    public DisplayStationDTO RequestedSourceStation { get; set; }
    public DisplayStationDTO RequestedDestinationStation { get; set; }
    public double TotalDistance{get;set;}
    public DisplayStationDTO SourceStation { get; set; }
    public DisplayStationDTO DestinationStation { get; set; }
    public List<DisplayTrainScheduleDTO> Schedules { get; set; } = new();

    public List<CoachAvailabilityDTO> Coaches { get; set; }=new ();
}