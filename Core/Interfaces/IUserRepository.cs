using Core.Entities;

namespace Core.Interfaces;

public interface IUserRepository
{
    Task AddUserAsync(User user);
}