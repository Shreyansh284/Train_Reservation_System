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
            .Where(t => t.IsActive)
            .ToListAsync();
    }

    public async Task<Train?> GetTrainByNumberAsync(string trainNumber)
    {
        return await context.Trains
            .Include(t => t.DestinationStation)
            .Include(t => t.Coaches)
            .Include(t => t.Schedules)
            .ThenInclude(s => s.Station)
            .Where(t => t.IsActive)
            .FirstOrDefaultAsync(t => t.TrainNumber == trainNumber);
    }
    public async Task<Train?> GetTrainByIdAsync(int trainId)
    {
        return await context.Trains
            .Include(t => t.DestinationStation)
            .Include(t => t.Coaches)
            .Include(t => t.Schedules)
            .ThenInclude(s => s.Station)
            .FirstOrDefaultAsync(t => t.TrainId==trainId);
    }

    public async Task UpdateTrain(Train train)
    {
         context.Trains.Update(train);
    }
    public async Task<List<Train>> GetTrainsBetweenStationsAsync(int fromStationId, int toStationId)
    {
        return await context.Trains
            .Include(t => t.Schedules.OrderBy(ts => ts.DistanceFromSource))
            .ThenInclude(ts => ts.Station)
            .Include(t => t.Coaches)
            .ThenInclude(c => c.Seats)
            .Where(t =>
                t.IsActive &&
                t.Schedules.Any(ts => ts.StationId == fromStationId) &&
                t.Schedules.Any(ts => ts.StationId == toStationId) &&
                t.Schedules
                    .Where(ts => ts.StationId == fromStationId)
                    .Select(ts => ts.DistanceFromSource)
                    .FirstOrDefault() <
                t.Schedules
                    .Where(ts => ts.StationId == toStationId)
                    .Select(ts => ts.DistanceFromSource)
                    .FirstOrDefault())
            .ToListAsync();
    }

    // public async Task<bool> IsTrainNumberExistsAsync(string trainNumber, int excludeTrainId)
    // {
    //     return await context.Trains
    //         .AnyAsync(t => t.TrainNumber == trainNumber && t.TrainId != excludeTrainId);
    // }
    //
    // public async Task<bool> IsTrainNameExistsAsync(string trainName, int excludeTrainId)
    // {
    //     return await context.Trains
    //         .AnyAsync(t => t.TrainName == trainName && t.TrainId != excludeTrainId);
    // }
    public async Task<bool> IsTrainNumberExistsAsync(string trainNumber)
    {
        return await context.Trains
            .AnyAsync(t => t.TrainNumber == trainNumber);
    }

    public async Task<bool> IsTrainNameExistsAsync(string trainName)
    {
        return await context.Trains
            .AnyAsync(t => t.TrainName == trainName);
    }

}