using Application.DTOs.TrainDTOs;
using Application.Exceptions;
using AutoMapper;
using Core.Interfaces;
using MediatR;

namespace Application.Queries.TrainQueries;

public record GetTrainByNumberQuery(int trainId) : IRequest<DisplayTrainDTO>;
public class GetTrainByNumberQueryHandler(
    ITrainRepository trainRepo,
    IMapper mapper
) : IRequestHandler<GetTrainByNumberQuery, DisplayTrainDTO>
{
    public async Task<DisplayTrainDTO> Handle(GetTrainByNumberQuery request, CancellationToken cancellationToken)
    {
        var train = await trainRepo.GetTrainByIdAsync(request.trainId);

        if (train == null)
            throw new NotFoundException($"Train not found.");

        return mapper.Map<DisplayTrainDTO>(train);
    }
}