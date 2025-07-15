using Application.DTOs.TrainDTOs;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using MediatR;

namespace Application.Queries.TrainQueries;

public record GetAvailableTrainsForSearchRequestQuery(SearchTrainRequestDTO searchTrain):IRequest<List<TrainAvailabilityDTO>>;

public class GetAvailableTrainsForSearchRequestQueryHandler(
    ITrainRepository _trainRepository,
    ISeatRepository _seatRepository,
    IMapper _mapper)
    : IRequestHandler<GetAvailableTrainsForSearchRequestQuery, List<TrainAvailabilityDTO>>
{
    public async Task<List<TrainAvailabilityDTO>> Handle(GetAvailableTrainsForSearchRequestQuery request,
        CancellationToken cancellationToken)
    {
        var searchDto = request.searchTrain;

        var trains = await _trainRepository.GetTrainsBetweenStationsAsync(
      searchDto.FromStationId, searchDto.ToStationId);

        var trainDtos = new List<TrainAvailabilityDTO>();
        foreach (var train in trains)
        {
            var dto = _mapper.Map<TrainAvailabilityDTO>(train);

            dto.Coaches = new List<CoachAvailabilityDto>();

            var groupedCoaches = train.Coaches.GroupBy(c => c.CoachClass);

            foreach (var group in groupedCoaches)
            {
                int totalSeats = 0;
                var availableSeats =new List<Seat>() ;

                foreach (var coach in group)
                {
                    totalSeats += coach.Seats.Count;
                    availableSeats.AddRange(await _seatRepository.GetAvailableSeatsAsync(coach.CoachId, searchDto.DateOfBooking,searchDto.FromStationId, searchDto.ToStationId));
                }

                dto.Coaches.Add(new CoachAvailabilityDto
                {
                    CoachType = group.Key.ToString(),
                    TotalSeats = totalSeats,
                    AvailableSeats = availableSeats.Count
                });
            }

            trainDtos.Add(dto);
        }

        return trainDtos;

    }


}