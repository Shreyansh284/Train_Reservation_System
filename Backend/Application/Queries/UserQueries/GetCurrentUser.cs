using AutoMapper;
using Core.Interfaces;
using MediatR;
using Application.Common.Interfaces;
using Application.DTOs.UserDTOs;

namespace Application.Queries.UserQueries;

public record GetCurrentUserQuery : IRequest<UserResponseDto>;

public class GetCurrentUserQueryHandler(IUserRepository userRepository, ICurrentUserService currentUserService, IMapper mapper)
    : IRequestHandler<GetCurrentUserQuery, UserResponseDto>
{
    public async Task<UserResponseDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        if (!currentUserService.UserId.HasValue)
        {
            throw new UnauthorizedAccessException("User not authenticated");
        }

        var user = await userRepository.GetByIdAsync(currentUserService.UserId.Value);

        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        return mapper.Map<UserResponseDto>(user);
    }
}