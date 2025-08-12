using Application.DTOs.StationDTOs;
namespace Application.DTOs.TrainScheduleDTOs;
public class CreateTrainScheduleDTO
{
    public CreateStationDTO Station { get; set; } = null!;
    public int DistanceFromSource { get; set; }

}