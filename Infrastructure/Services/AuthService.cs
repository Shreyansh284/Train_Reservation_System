using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Services;

public class AuthService(IUserRepository userRepository, ITokenService tokenService) : IAuthService
{
    public async Task<string?> AuthenticateAsync(string email, string password)
    {
        var user = await userRepository.GetByEmailAsync(email);
        if (user is null) return null;

        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, password);
        if (result == PasswordVerificationResult.Failed) return null;

        return tokenService.GenerateToken(user);
    }
}
