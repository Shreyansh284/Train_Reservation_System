using Application.DTOs.User;
using Application.DTOs.UserDTOs;
using AutoMapper;
using Core.Entities;

namespace Application.MappingProfiles;

public class UserMappingProfile:Profile
{
    public UserMappingProfile()
    {
        CreateMap<UserRegisterationDTO, User>();
        CreateMap<User, DisplayUserDTO>();
        CreateMap<User, UserResponseDto>();
    }
}