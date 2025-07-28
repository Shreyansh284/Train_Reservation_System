using Application.DTOs.CoachDTOs;
using Application.DTOs.StationDTOs;
using Application.DTOs.TrainDTOs;
using Application.DTOs.TrainScheduleDTOs;
using AutoMapper;
using Core.Entities;

namespace Application.MappingProfiles;

public class TrainMappingProfiles : Profile
{
    public TrainMappingProfiles()
    {
        CreateMap<CreateTrainDTO, Train>();

        CreateMap<Train, DisplayTrainDTO>();
        CreateMap<Train, TrainAvailabilityDTO>()
            .ForMember(dest => dest.Coaches, opt => opt.Ignore())
            .ForMember(dest=>dest.SourceStation,opt=>opt.MapFrom(src=>src.SourceStation))
            .ForMember(dest=>dest.DestinationStation,opt=>opt.MapFrom(src=>src.DestinationStation))
            .ForMember(dest => dest.Schedules, opt => opt.MapFrom(src =>
                src.Schedules.OrderBy(s => s.DistanceFromSource)));
    }
}