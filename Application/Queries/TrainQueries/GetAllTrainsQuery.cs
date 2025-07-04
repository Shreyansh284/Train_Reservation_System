using Application.DTOs.StationDTOs;
using Application.DTOs.TrainDTOs;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using MediatR;

namespace Application.Queries.TrainQueries;

public record GetAllTrainsQuery:IRequest<IEnumerable<DisplayTrainDTO>>;

public class GetAllTrainsQueryHandler(
    ITrainRepository trainRepo,
    IMapper mapper
) : IRequestHandler<GetAllTrainsQuery, IEnumerable<DisplayTrainDTO>>
{
    public async Task<IEnumerable<DisplayTrainDTO>> Handle(GetAllTrainsQuery request, CancellationToken cancellationToken)
    {
        var trains = await trainRepo.GetAllTrainsAsync();
        return mapper.Map<IEnumerable<DisplayTrainDTO>>(trains);
    }
}