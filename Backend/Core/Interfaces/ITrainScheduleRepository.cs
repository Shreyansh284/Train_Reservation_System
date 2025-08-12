using Core.Entities;

namespace Core.Interfaces;

public interface ITrainScheduleRepository
{
    Task AddTrainScheduleAsync(TrainSchedule schedule);
    Task<TrainSchedule?> GetTrainScheduleByTrainIdAndStationIdAsync(int trainId, int stationId);
    Task<int> GetDistanceBetweenStationsAsync(int trainId ,int startStationId, int endStationId);
}