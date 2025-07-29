using System.Threading.Tasks;

namespace Core.Interfaces;

public interface IAuthService
{
    /// <summary>
    /// Authenticate user credentials and return JWT token if successful; otherwise null.
    /// </summary>
    /// <param name="email">User email/username</param>
    /// <param name="password">Plain text password</param>
    /// <returns>JWT token or null</returns>
    Task<string?> AuthenticateAsync(string email, string password);
}
