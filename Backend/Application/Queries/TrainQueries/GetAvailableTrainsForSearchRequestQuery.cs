using Application.Common.Interfaces;
using Application.DTOs.TrainDTOs;
using Core.Interfaces;
using MediatR;

namespace Application.Queries.TrainQueries;

public record GetAvailableTrainsForSearchRequestQuery(SearchTrainRequestDTO SearchTrainRequestDTO):IRequest<List<TrainAvailabilityDTO>>;

public class GetAvailableTrainsForSearchRequestQueryHandler(
    ITrainRepository _trainRepository,
    ITrainMappingHelper trainMappingHelper)
    : IRequestHandler<GetAvailableTrainsForSearchRequestQuery, List<TrainAvailabilityDTO>>
{
    public async Task<List<TrainAvailabilityDTO>> Handle(GetAvailableTrainsForSearchRequestQuery request,
        CancellationToken cancellationToken)
    {
        var searchDto = request.SearchTrainRequestDTO;

        var trains = await _trainRepository.GetTrainsBetweenStationsAsync(
            searchDto.FromStationId, searchDto.ToStationId
        );
        var trainDtos = new List<TrainAvailabilityDTO>();
        foreach (var train in trains)
        {
            trainDtos.Add(await trainMappingHelper.BuildTrainAvailabilityDTOAsync(train, searchDto));
        }

        return  trainDtos.ToList();
    }


}