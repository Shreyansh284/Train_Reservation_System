using Application.Common.Interfaces;
using Application.DTOs.TrainDTOs;
using Core.Interfaces;
using MediatR;

namespace Application.Queries.TrainQueries;

public record GetTrainDetailsBySearchRequest(int TrainId, SearchTrainRequestDTO searchTrainRequest)
    : IRequest<TrainAvailabilityDTO>;

public class GetTrainDetailsBySearchRequestQueryHandler(
    ITrainRepository trainRepository,
    ITrainMappingHelper trainMappingHelper) : IRequestHandler<GetTrainDetailsBySearchRequest, TrainAvailabilityDTO>
{
    public async Task<TrainAvailabilityDTO> Handle(GetTrainDetailsBySearchRequest request, CancellationToken cancellationToken)
    {
        var train = await trainRepository.GetTrainByIdAsync(request.TrainId);
        var fetchedTrain= await trainMappingHelper.BuildTrainAvailabilityDTOAsync(train, request.searchTrainRequest);
        return fetchedTrain;
    }
}