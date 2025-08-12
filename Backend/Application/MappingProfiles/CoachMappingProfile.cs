using Application.DTOs.CoachDTOs;
using Application.DTOs.TrainDTOs;
using AutoMapper;
using Core.Entities;

namespace Application.MappingProfiles;

public class CoachMappingProfile : Profile
{
    public CoachMappingProfile()
    {
        CreateMap<CreateCoachDTO, Coach>();
        CreateMap<Coach, DisplayCoachDTO>()
            .ForMember(dest => dest.CoachClass, opt => opt.MapFrom(src => src.CoachClass.ToString()));
        CreateMap<Coach, CoachAvailabilityDTO>()
            .ForMember(dest=>dest.CoachType,opt=>opt.MapFrom(src=>src.CoachClass.ToString()));
    }
}