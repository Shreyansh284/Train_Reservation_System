using Core.Entities;

namespace Core.Interfaces;

public interface ITrainScheduleRepository
{
    Task AddTrainScheduleAsync(TrainSchedule schedule);
}