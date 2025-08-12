using Application.DTOs.BookingDTOs;
using AutoMapper;
using Core.Interfaces;
using MediatR;

namespace Application.Queries.BookingQueries;

public record GetAllBookingsQuery:IRequest<IEnumerable<PassengerBookingInfoDTO>>;

public class GetAllBookingsQueryHandler(IBookingRepository bookingRepository,IMapper mapper) : IRequestHandler<GetAllBookingsQuery, IEnumerable<PassengerBookingInfoDTO>>
{
    public async Task<IEnumerable<PassengerBookingInfoDTO>> Handle(GetAllBookingsQuery request,
        CancellationToken cancellationToken)
    {
        var bookings=await bookingRepository.GetAllBookings();
        return mapper.Map<IEnumerable<PassengerBookingInfoDTO>>(bookings);
    }
}