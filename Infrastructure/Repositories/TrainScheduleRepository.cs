using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class TrainScheduleRepository(AppDbContext context) : ITrainScheduleRepository
{
    public async Task AddTrainScheduleAsync(TrainSchedule schedule)
    {
        await context.TrainSchedules.AddAsync(schedule);
    }

    public async Task<TrainSchedule?> GetTrainScheduleByTrainIdAndStationIdAsync(int trainId, int stationId)
    {
        return await context.TrainSchedules
            .Include(s => s.Station)
            .Where(s => s.TrainId == trainId && s.StationId == stationId)
            .SingleOrDefaultAsync();

    }


        public async Task<int> GetDistanceBetweenStationsAsync(int startStationId, int endStationId)
        {
            var start = await context.TrainSchedules
                .Where(s => s.StationId == startStationId)
                .Select(s => s.DistanceFromSource)
                .FirstOrDefaultAsync();

            var end = await context.TrainSchedules
                .Where(s => s.StationId == endStationId)
                .Select(s => s.DistanceFromSource)
                .FirstOrDefaultAsync();

            return Math.Abs(end - start);
        }


}