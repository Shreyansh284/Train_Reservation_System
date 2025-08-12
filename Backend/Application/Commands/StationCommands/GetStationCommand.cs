using Application.DTOs.StationDTOs;
using AutoMapper;
using Core.Interfaces;
using MediatR;

namespace Application.Commands.StationCommands;

public record GetStationCommand(string query):IRequest<IEnumerable<DisplayStationDTO>>;

public class GetStationCommandHandler(IStationRepository stationRepository,IMapper mapper) : IRequestHandler<GetStationCommand, IEnumerable<DisplayStationDTO>>
{
    public async Task<IEnumerable<DisplayStationDTO>> Handle(GetStationCommand request,
        CancellationToken cancellationToken)
    {
        var stations= await stationRepository.GetStationsByQueryAsync(request.query);
        return mapper.Map<IEnumerable<DisplayStationDTO>>(stations);
    }
}