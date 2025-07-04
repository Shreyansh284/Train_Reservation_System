using Application.DTOs.SeatDTOs;
using AutoMapper;
using Core.Entities;

namespace Application.MappingProfiles;

public class SeatMappingProfile: Profile
{
    public SeatMappingProfile()
    {
        CreateMap<AddSeatDTO, Seat>();
        CreateMap<Seat, DisplaySeatDTO>()
            .ForMember(dest=>dest.CoachNumber,opt=>opt.MapFrom(src=>src.Coach.CoachNumber))
            .ForMember(dest=>dest.CoachType,opt=>opt.MapFrom(src=>src.Coach.CoachClass.ToString()));
    }
}