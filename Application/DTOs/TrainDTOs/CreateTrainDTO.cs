using Application.DTOs.CoachDTOs;
using Application.DTOs.TrainScheduleDTOs;

namespace Application.DTOs.TrainDTOs;

public class CreateTrainDTO
{
    public string TrainNumber { get; set; }
    public string TrainName { get; set; }
    public List<CreateCoachDTO> Coaches { get; set; } = new();
    public List<CreateTrainScheduleDTO> Stations { get; set; } = new();
}