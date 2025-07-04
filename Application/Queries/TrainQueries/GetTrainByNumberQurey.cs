using Application.DTOs.TrainDTOs;
using Application.Exceptions;
using AutoMapper;
using Core.Interfaces;
using MediatR;

namespace Application.Queries.TrainQueries;

public record GetTrainByNumberQuery(string TrainNumber) : IRequest<DisplayTrainDTO>;
public class GetTrainByNumberQueryHandler(
    ITrainRepository trainRepo,
    IMapper mapper
) : IRequestHandler<GetTrainByNumberQuery, DisplayTrainDTO>
{
    public async Task<DisplayTrainDTO> Handle(GetTrainByNumberQuery request, CancellationToken cancellationToken)
    {
        var train = await trainRepo.GetTrainByNumberAsync(request.TrainNumber);

        if (train == null)
            throw new NotFoundException($"Train with Train Number '{request.TrainNumber}' was not found.");

        return mapper.Map<DisplayTrainDTO>(train);
    }
}