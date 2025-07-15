using Application.DTOs.SeatDTOs;
using Application.DTOs.TrainDTOs;
using Application.Exceptions;
using AutoMapper;
using MediatR;
using Core.Entities;
using Core.Interfaces;

namespace Application.Commands.TrainCommands;

public record AddTrainCommand(CreateTrainDTO TrainDTO) : IRequest<DisplayTrainDTO>;

public class AddTrainCommandHandler(
    ITrainRepository trainRepo,
    IStationRepository stationRepo,
    ICoachRepository coachRepo,
    ITrainScheduleRepository scheduleRepo,
    ISeatRepository seatRepo,
    IUnitOfWork unitOfWork,
    IMapper mapper
) : IRequestHandler<AddTrainCommand, DisplayTrainDTO>
{
    public async Task<DisplayTrainDTO> Handle(AddTrainCommand request, CancellationToken cancellationToken)
    {
        var dto = request.TrainDTO;
        var existingTrain = await trainRepo.GetTrainByNumberAsync(dto.TrainNumber);

        if (existingTrain != null)
        {
            throw new NotFoundException($"Train with TrainNumber {dto.TrainNumber} already exists.");
        }

        // Source Station
        var firstStation = dto.Stations[0].Station;
        var sourceStation = await stationRepo.GetStationByCodeAsync(firstStation.StationCode)
                            ?? await stationRepo.AddStationAsync(mapper.Map<Station>(firstStation));

        // Destination Station
        var lastStation = dto.Stations[^1].Station;
        var destinationStation = await stationRepo.GetStationByCodeAsync(lastStation.StationCode)
                                ?? await stationRepo.AddStationAsync(mapper.Map<Station>(lastStation));

        // Create Train
        var train = new Train
        {
            TrainNumber = dto.TrainNumber,
            TrainName = dto.TrainName,
            SourceStation = sourceStation,
            DestinationStation = destinationStation,
            CreatedAt = DateTime.Now,
        };

        await trainRepo.AddTrainAsync(train);
        await unitOfWork.SaveChangesAsync();
        // Add Coaches
        foreach (var coachDto in dto.Coaches)
        {
            var coach = mapper.Map<Coach>(coachDto);
            coach.TrainId = train.TrainId;
            await coachRepo.AddCoachAsync(coach);
            await unitOfWork.SaveChangesAsync();

            for(int i=1;i<=coach.TotalSeats;i++)
            {
                var addSeatDto = new AddSeatDTO { CoachId = coach.CoachId, SeatNumber = $"{coach.CoachNumber}-{i}" };
                var seat=mapper.Map<Seat>(addSeatDto);
                await seatRepo.AddSeatAsync(seat);
                await unitOfWork.SaveChangesAsync();
            }
        }

        // Add Schedules
        foreach (var scheduleDto in dto.Stations)
        {
            var station = await stationRepo.GetStationByCodeAsync(scheduleDto.Station.StationCode)
                         ?? await stationRepo.AddStationAsync(mapper.Map<Station>(scheduleDto.Station));

            var schedule = new TrainSchedule
            {
                TrainId = train.TrainId,
                StationId = station.StationId,
                DistanceFromSource = scheduleDto.DistanceFromSource,
            };

            await scheduleRepo.AddTrainScheduleAsync(schedule);
            await unitOfWork.SaveChangesAsync();
        }

        await unitOfWork.SaveChangesAsync();

        return mapper.Map<DisplayTrainDTO>(train);
    }
}