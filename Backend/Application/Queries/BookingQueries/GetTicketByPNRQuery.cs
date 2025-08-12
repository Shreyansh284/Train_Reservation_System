using Application.Common.Interfaces;
using Application.DTOs.BookingDTOs;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using MediatR;

namespace Application.Queries.BookingQueries;

public record GetTicketByPNRQuery(long pnr):IRequest<PassengerBookingInfoDTO>;

public class GetTicketByPNRQueryHandler(IBookingRepository bookingRepository,ICurrentUserService currentUserService,IMapper mapper) : IRequestHandler<GetTicketByPNRQuery, PassengerBookingInfoDTO>
{
    public async Task<PassengerBookingInfoDTO> Handle(GetTicketByPNRQuery request, CancellationToken cancellationToken)
    {

        if (!currentUserService.UserId.HasValue)
        {
            throw new UnauthorizedAccessException("User not authenticated");
        }
        var userId = currentUserService.UserId.Value;
        var bookingDetails = await bookingRepository.GetBookingWithDetailsByPNR(request.pnr);
        if (bookingDetails.UserId != userId)
        {
            throw new UnauthorizedAccessException("User not authorized");
        }
        return mapper.Map<PassengerBookingInfoDTO>(bookingDetails);
    }
}