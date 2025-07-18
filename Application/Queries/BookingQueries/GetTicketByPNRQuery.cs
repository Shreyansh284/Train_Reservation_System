using Application.DTOs.BookingDTOs;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using MediatR;

namespace Application.Queries.BookingQueries;

public record GetTicketByPNRQuery(long pnr):IRequest<PassengerBookingInfoDTO>;

public class GetTicketByPNRQueryHandler(IBookingRepository bookingRepository,IMapper mapper) : IRequestHandler<GetTicketByPNRQuery, PassengerBookingInfoDTO>
{
    public async Task<PassengerBookingInfoDTO> Handle(GetTicketByPNRQuery request, CancellationToken cancellationToken)
    {
        var bookingDetails = await bookingRepository.GetBookingWithDetailsByPNR(request.pnr);
        return mapper.Map<PassengerBookingInfoDTO>(bookingDetails);
    }
}