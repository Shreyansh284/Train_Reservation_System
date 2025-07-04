using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class TrainRepository(AppDbContext context):ITrainRepository
{
    public async Task AddTrainAsync(Train train)
    {
         await context.Trains.AddAsync(train);
    }

    public async Task<IEnumerable<Train>> GetAllTrainsAsync()
    {
        return await context.Trains.Include(t => t.SourceStation)
            .Include(t => t.DestinationStation)
            .Include(t => t.Coaches)
            .Include(t => t.Schedules)
            .ThenInclude(s => s.Station)
            .Where(t => !t.IsDeleted)
            .ToListAsync();
    }

    public async Task<Train?> GetTrainByNumberAsync(string trainNumber)
    {
        return await context.Trains
            .Include(t => t.DestinationStation)
            .Include(t => t.Coaches)
            .Include(t => t.Schedules)
            .ThenInclude(s => s.Station)
            .Where(t => !t.IsDeleted)
            .FirstOrDefaultAsync(t => t.TrainNumber == trainNumber);
    }

    public async Task DeleteTrainAsync(Train train)
    {
         context.Trains.Update(train);
    }
}