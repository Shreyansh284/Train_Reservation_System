using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class CoachRepository(AppDbContext context) : ICoachRepository
{
    public async Task AddCoachAsync(Coach coach)
    {
        await context.Coaches.AddAsync(coach);
    }
}