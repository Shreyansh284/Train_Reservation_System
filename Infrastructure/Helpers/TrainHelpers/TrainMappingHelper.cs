using Application.Comman.Interfaces;
using Application.DTOs.CoachDTOs;
using Application.DTOs.StationDTOs;
using Application.DTOs.TrainDTOs;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Helpers.TrainHelpers;

public class TrainMappingHelper(IMapper mapper,
    ISeatRepository seatRepository,
    IStationRepository stationRepository,
    ITrainScheduleRepository trainScheduleRepository):ITrainMappingHelper
{
    public async Task<TrainAvailabilityDTO> BuildTrainAvailabilityDTOAsync(Train train, SearchTrainRequestDTO searchDto)
    {
        var dto = mapper.Map<TrainAvailabilityDTO>(train);
        var sourceStation = await stationRepository.GetStationById(searchDto.FromStationId);
        var destinationStation = await stationRepository.GetStationById(searchDto.ToStationId);
        dto.RequestedSourceStation = mapper.Map<DisplayStationDTO>(sourceStation);
        dto.RequestedDestinationStation = mapper.Map<DisplayStationDTO>(destinationStation);
        dto.TotalDistance=await trainScheduleRepository.GetDistanceBetweenStationsAsync(train.TrainId,searchDto.FromStationId, searchDto.ToStationId);
        dto.Coaches = new List<CoachAvailabilityDTO>();

        var groupedCoaches = train.Coaches.GroupBy(c => c.CoachClass);

        foreach (var group in groupedCoaches)
        {
            int totalSeats = 0;
            var availableSeats = new List<Seat>();

            foreach (var coach in group)
            {
                totalSeats += coach.TotalSeats;

                var seats = await seatRepository.GetAvailableSeatsAsync(
                    coach.CoachId, DateTime.Parse(searchDto.DateOfBooking),searchDto.FromStationId, searchDto.ToStationId);

                availableSeats.AddRange(seats);
            }

            dto.Coaches.Add(new CoachAvailabilityDTO
            {
                CoachType = group.Key.ToString(),
                TotalSeats = totalSeats,
                AvailableSeats = availableSeats.Count
            });
        }

        return dto;
    }

}