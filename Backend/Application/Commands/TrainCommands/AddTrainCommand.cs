using Application.DTOs.SeatDTOs;
using Application.DTOs.TrainDTOs;
using Application.Exceptions;
using AutoMapper;
using MediatR;
using Core.Entities;
using Core.Interfaces;
using Application.DTOs.StationDTOs;

namespace Application.Commands.TrainCommands;

public record AddTrainCommand(CreateTrainDTO TrainDto) : IRequest<DisplayTrainDTO>;

public class AddTrainCommandHandler(
    ITrainRepository trainRepository,
    IStationRepository stationRepository,
    ICoachRepository coachRepository,
    ITrainScheduleRepository scheduleRepository,
    ISeatRepository seatRepository,
    IUnitOfWork unitOfWork,
    IMapper mapper
) : IRequestHandler<AddTrainCommand, DisplayTrainDTO>
{
    public async Task<DisplayTrainDTO> Handle(AddTrainCommand request, CancellationToken cancellationToken)
    {
        var trainDto = request.TrainDto;

        await EnsureTrainDoesNotExist(trainDto.TrainNumber);

        var sourceStation = await GetOrCreateStationAsync(trainDto.Stations.First().Station);
        var destinationStation = await GetOrCreateStationAsync(trainDto.Stations.Last().Station);

        var train = await CreateTrainAsync(trainDto, sourceStation, destinationStation);

        await AddCoachesAndSeatsAsync(trainDto, train);
        await AddSchedulesAsync(trainDto, train);

        await unitOfWork.SaveChangesAsync();

        return mapper.Map<DisplayTrainDTO>(train);
    }

    // ✅ Ensure train number is unique
    private async Task EnsureTrainDoesNotExist(string trainNumber)
    {
        var existingTrain = await trainRepository.GetTrainByNumberAsync(trainNumber);
        if (existingTrain != null)
        {
            throw new NotFoundException($"Train with TrainNumber {trainNumber} already exists.");
        }
    }

    // ✅ Get or create station
    private async Task<Station> GetOrCreateStationAsync(CreateStationDTO stationDto)
    {
        var station = await stationRepository.GetStationByCodeAsync(stationDto.StationCode);
        if (station != null) return station;

        var newStation = mapper.Map<Station>(stationDto);
        var addedStation = await stationRepository.AddStationAsync(newStation);
        await unitOfWork.SaveChangesAsync();

        return addedStation;
    }

    // ✅ Create train 
    private async Task<Train> CreateTrainAsync(CreateTrainDTO trainDto, Station sourceStation, Station destinationStation)
    {
        var train = new Train
        {
            TrainNumber = trainDto.TrainNumber,
            TrainName = trainDto.TrainName,
            SourceStation = sourceStation,
            DestinationStation = destinationStation,
            CreatedAt = DateTime.UtcNow,
        };

        await trainRepository.AddTrainAsync(train);
        await unitOfWork.SaveChangesAsync();

        return train;
    }

    // ✅ Add coaches and seats
    private async Task AddCoachesAndSeatsAsync(CreateTrainDTO trainDto, Train train)
    {
        foreach (var coachDto in trainDto.Coaches)
        {
            var coach = mapper.Map<Coach>(coachDto);
            coach.TrainId = train.TrainId;

            await coachRepository.AddCoachAsync(coach);
            await unitOfWork.SaveChangesAsync();

            for (int i = 1; i <= coach.TotalSeats; i++)
            {
                var seatNumber = $"{coach.CoachNumber}-{i}";
                var addSeatDto = new AddSeatDTO { CoachId = coach.CoachId, SeatNumber = seatNumber };

                var seat = mapper.Map<Seat>(addSeatDto);
                await seatRepository.AddSeatAsync(seat);
                await unitOfWork.SaveChangesAsync();
            }

            await unitOfWork.SaveChangesAsync();
        }
    }

    // ✅ Add schedules
    private async Task AddSchedulesAsync(CreateTrainDTO trainDto, Train train)
    {
        foreach (var scheduleDto in trainDto.Stations)
        {
            var station = await GetOrCreateStationAsync(scheduleDto.Station);

            var schedule = new TrainSchedule
            {
                TrainId = train.TrainId,
                StationId = station.StationId,
                DistanceFromSource = scheduleDto.DistanceFromSource,
            };

            await scheduleRepository.AddTrainScheduleAsync(schedule);
            await unitOfWork.SaveChangesAsync();
        }

        await unitOfWork.SaveChangesAsync();
    }
}
