using Application.DTOs.UserDTOs;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Commands.UserCommand;

public record AddUserCommand(UserRegisterationDTO userDto) : IRequest<DisplayUserDTO>;

public class AddUserCommandHandler(IUserRepository userRepository, IUnitOfWork unitOfWork,IMapper mapper)
    : IRequestHandler<AddUserCommand, DisplayUserDTO>
{
    public async Task<DisplayUserDTO> Handle(AddUserCommand request, CancellationToken cancellationToken)
    {
        var userDetailsDTo=request.userDto;
        var user=mapper.Map<User>(userDetailsDTo);
        var plainPassword = userDetailsDTo.Password;
        var hashedPassword= new PasswordHasher<User>().HashPassword(user,plainPassword);
        user.PasswordHash = hashedPassword;
        await userRepository.AddUserAsync(user);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<DisplayUserDTO>(user);
    }
}