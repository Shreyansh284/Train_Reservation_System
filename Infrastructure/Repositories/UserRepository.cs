using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserRepository(AppDbContext dbContext):IUserRepository
{
    public async Task AddUserAsync(User user)
    {
        await dbContext.Users.AddAsync(user);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await dbContext.Users.SingleOrDefaultAsync(u => u.Email == email);
    }
    public async Task<User?> GetByIdAsync(int id)
    {
        return await dbContext.Users.FindAsync(id);
    }
}