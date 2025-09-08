using Application.DTOs.BookingDTOs;
using AutoMapper;
using Core.Interfaces;
using MediatR;

namespace Application.Queries.BookingQueries;

public record GetAllBookingsQuery:IRequest<IEnumerable<DisplayAllBookingsDTO>>;

public class GetAllBookingsQueryHandler(IBookingRepository bookingRepository,IMapper mapper) : IRequestHandler<GetAllBookingsQuery, IEnumerable<DisplayAllBookingsDTO>>
{
    public async Task<IEnumerable<DisplayAllBookingsDTO>> Handle(GetAllBookingsQuery request,
        CancellationToken cancellationToken)
    {
        var bookings=await bookingRepository.GetAllBookings();
        return mapper.Map<IEnumerable<DisplayAllBookingsDTO>>(bookings);
    }
}