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
    }
}