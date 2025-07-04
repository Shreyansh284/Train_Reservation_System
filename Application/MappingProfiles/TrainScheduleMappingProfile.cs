using Application.DTOs.TrainScheduleDTOs;
using AutoMapper;
using Core.Entities;

namespace Application.MappingProfiles;

public class TrainScheduleMappingProfile:Profile
{
    public TrainScheduleMappingProfile()
    {

        CreateMap<TrainSchedule, DisplayTrainScheduleDTO>();

        CreateMap<CreateTrainScheduleDTO, TrainSchedule>()
            .ForMember(dest => dest.Station, opt => opt.MapFrom(src => src.Station));

    }
}