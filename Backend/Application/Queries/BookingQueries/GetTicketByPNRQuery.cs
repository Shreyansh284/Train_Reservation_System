using Application.Common.Interfaces;
using Application.DTOs.BookingDTOs;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using MediatR;
using Application.Exceptions;

namespace Application.Queries.BookingQueries;

public record GetTicketByPNRQuery(long PNR) : IRequest<PassengerBookingInfoDTO>;

public class GetTicketByPNRQueryHandler(IBookingRepository bookingRepository, ICurrentUserService currentUserService, IMapper mapper) : IRequestHandler<GetTicketByPNRQuery, PassengerBookingInfoDTO>
{
    public async Task<PassengerBookingInfoDTO> Handle(GetTicketByPNRQuery request, CancellationToken cancellationToken)
    {

        if (!currentUserService.UserId.HasValue)
        {
            throw new UnauthorizedAccessException("User not authenticated");
        }
        var userId = currentUserService.UserId.Value;
        var bookingDetails = await bookingRepository.GetBookingWithDetailsByPNR(request.PNR);
        if (bookingDetails == null)
        {
            throw new NotFoundException("Booking not found for provided PNR");
        }
        if (bookingDetails.UserId != userId)
        {
            throw new UnauthorizedAccessException("User not authorized");
        }
        return mapper.Map<PassengerBookingInfoDTO>(bookingDetails);
    }
}