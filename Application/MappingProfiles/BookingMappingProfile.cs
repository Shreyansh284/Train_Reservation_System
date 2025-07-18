using Application.DTOs.BookingDTOs;
using Application.DTOs.TrainDTOs;
using AutoMapper;
using Core.Entities;

namespace Application.MappingProfiles;

public class BookingMappingProfile:Profile
{
    public BookingMappingProfile()
    {
        CreateMap<SearchTrainRequestDTO,Booking>();
        CreateMap<Booking, PassengerBookingInfoDTO>()
            .ForMember(dest => dest.PNR, opt => opt.MapFrom(src => src.PNR.ToString()))
            .ForMember(dest => dest.TrainName, opt => opt.MapFrom(src => src.Train.TrainName))
            .ForMember(dest => dest.FromStation, opt => opt.MapFrom(src => src.FromStation.StationName))
            .ForMember(dest => dest.ToStation, opt => opt.MapFrom(src => src.ToStation.StationName))
            .ForMember(dest => dest.JourneyDate, opt => opt.MapFrom(src => src.JourneyDate))
            .ForMember(dest => dest.TotalFare, opt => opt.MapFrom(src => src.TotalFare))
            .ForMember(dest => dest.Passengers, opt => opt.MapFrom(src => src.Passengers));

        CreateMap<Booking, DisplayAllBookingsDTO>();
        CreateMap<Passenger, DisplayPassengerInfoDTO>()
            .ForMember(dest => dest.SeatNumber, opt => opt.MapFrom(src => src.Seat.SeatNumber))
            .ForMember(dest => dest.CoachNumber, opt => opt.MapFrom(src => src.Seat.Coach.CoachNumber))
            .ForMember(dest => dest.CoachType, opt => opt.MapFrom(src => src.CoachClass.ToString()))
            .ForMember(dest=>dest.BookingStatus,opt=>opt.MapFrom(src=>src.Status.ToString()));
    }


}