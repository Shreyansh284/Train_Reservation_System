using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class TrainScheduleRepository(AppDbContext context) : ITrainScheduleRepository
{
    public async Task AddTrainScheduleAsync(TrainSchedule schedule) => await context.TrainSchedules.AddAsync(schedule);
}