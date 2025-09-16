using Application.Common.Interfaces;
using Application.DTOs.TrainDTOs;
using Application.Exceptions;
using Core.Interfaces;
using MediatR;

namespace Application.Queries.TrainQueries;

public record GetTrainDetailsBySearchRequest(int TrainId, SearchTrainRequestDTO SearchTrainRequestDTO)
    : IRequest<TrainAvailabilityDTO>;

public class GetTrainDetailsBySearchRequestQueryHandler(
    ITrainRepository trainRepository,
    ITrainMappingHelper trainMappingHelper) : IRequestHandler<GetTrainDetailsBySearchRequest, TrainAvailabilityDTO>
{
    public async Task<TrainAvailabilityDTO> Handle(GetTrainDetailsBySearchRequest request, CancellationToken cancellationToken)
    {
        var train = await trainRepository.GetTrainByIdAsync(request.TrainId);
        if (train == null)
        {
            throw new NotFoundException("Train not found.");
        }
        var fetchedTrain= await trainMappingHelper.BuildTrainAvailabilityDTOAsync(train, request.SearchTrainRequestDTO);
        return fetchedTrain;
    }
}