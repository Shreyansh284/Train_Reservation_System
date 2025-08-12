using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CoachRepository(AppDbContext context) : ICoachRepository
{
    public async Task AddCoachAsync(Coach coach)
    {
        await context.Coaches.AddAsync(coach);
    }

    public async Task<Coach?> GetCoachByTrainIdAndCoachId(int trainId, int coachId)
    {
        return await context.Coaches.SingleOrDefaultAsync(c=>c.TrainId==trainId && c.CoachId==coachId);
    }
    public async Task UpdateCoachAsync(Coach coach)
    {
        context.Coaches.Update(coach);
    }
}