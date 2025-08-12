using Core.Entities;

namespace Core.Interfaces;

public interface IUserRepository
{
    Task AddUserAsync(User user);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(int id);
}