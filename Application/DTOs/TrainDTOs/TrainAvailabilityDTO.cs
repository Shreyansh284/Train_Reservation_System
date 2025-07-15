using Application.DTOs.CoachDTOs;
using Application.DTOs.StationDTOs;
using Application.DTOs.TrainScheduleDTOs;

namespace Application.DTOs.TrainDTOs;

public class TrainAvailabilityDTO
{
    public string TrainNumber { get; set; }
    public string TrainName { get; set; }
    public DisplayStationDTO SourceStation { get; set; }
    public DisplayStationDTO DestinationStation { get; set; }

    public List<DisplayTrainScheduleDTO> Schedules { get; set; } = new();


    public List<CoachAvailabilityDto> Coaches { get; set; }=new ();
}
public class CoachAvailabilityDto
{
    public string CoachType { get; set; }
    public int TotalSeats { get; set; }
    public int AvailableSeats { get; set; }
}