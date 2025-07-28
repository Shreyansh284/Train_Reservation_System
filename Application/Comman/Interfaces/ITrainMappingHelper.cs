using Application.DTOs.TrainDTOs;
using Core.Entities;

namespace Application.Comman.Interfaces;

public interface ITrainMappingHelper
{
    Task<TrainAvailabilityDTO> BuildTrainAvailabilityDTOAsync(Train train, SearchTrainRequestDTO searchDto);
}