using Application.DTOs.TrainDTOs;
using Application.Exceptions;
using AutoMapper;
using Core.Interfaces;
using MediatR;

namespace Application.Commands.TrainCommands;

public record EditTrainStationCommand(int TrainId,int StationId,EditTrainStationDTO Dto) : IRequest<DisplayTrainDTO>;

public class EditTrainStationCommandHandler(IMapper mapper,ITrainRepository trainRepository,
    ITrainScheduleRepository trainScheduleRepository,
    IStationRepository stationRepository,
    IUnitOfWork unitOfWork):IRequestHandler<EditTrainStationCommand, DisplayTrainDTO>
{
    public async Task<DisplayTrainDTO> Handle(EditTrainStationCommand request, CancellationToken cancellationToken)
    {
        var train = await trainRepository.GetTrainByIdAsync(request.TrainId);
        if (train == null)
        {
            throw new NotFoundException("Train not found.");
        }
        var trainSchedule = await trainScheduleRepository.GetTrainScheduleByTrainIdAndStationIdAsync(request.TrainId, request.StationId);
        if (trainSchedule==null)
        {
            throw new NotFoundException("Station not found for this train.");
        }
        var station = trainSchedule.Station;

        var stationInfo=request.Dto.Station;

        if (stationInfo.StationName != null)
        {
            station.StationName=stationInfo.StationName;
        }

        if (stationInfo.City != null)
        {
          station.City=stationInfo.City;
        }

        if (stationInfo.State != null)
        {
          station.State=stationInfo.State;
        }
        await stationRepository.UpdateStationAsync(station);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<DisplayTrainDTO>(train);
    }
}