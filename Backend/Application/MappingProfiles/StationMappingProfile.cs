using Application.DTOs.StationDTOs;
using AutoMapper;
using Core.Entities;

namespace Application.MappingProfiles;

public class StationMappingProfile : Profile
{
    public StationMappingProfile()
    {
        // CreateStationDTO -> Station (for create)
        CreateMap<CreateStationDTO, Station>()
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore()) // prevent overriding IsDeleted
            .ForMember(dest => dest.StationId, opt => opt.Ignore()); // StationId is auto-generated

        // EditStationDTO -> Station (for update)
        CreateMap<EditStationDTO, Station>()
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore()) // don't allow changing IsDeleted from DTO
            .ForMember(dest => dest.StationId, opt => opt.Ignore()); // ID is not set from edit DTO

        // Station -> DisplayStationDTO (for output)
        CreateMap<Station, DisplayStationDTO>();
    }
}