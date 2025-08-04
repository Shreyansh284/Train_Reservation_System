using Application.DTOs.UserDTOs;
using AutoMapper;
using Core.Entities;

namespace Application.MappingProfiles;

public class UserMappingProfile:Profile
{
    public UserMappingProfile()
    {
        CreateMap<UserRegisterationDTO, User>();
        CreateMap<User, UserResponseDto>().ForMember(x=>x.UserRole,y=>y.MapFrom(x=>x.UserRole.ToString()));
    }
}