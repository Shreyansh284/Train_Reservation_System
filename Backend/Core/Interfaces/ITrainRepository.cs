using Core.Entities;

namespace Core.Interfaces;

public interface ITrainRepository
{
    Task AddTrainAsync(Train train);
    Task<Train?> GetTrainByNumberAsync(string trainNumber);
    Task<Train?> GetTrainByIdAsync(int trainId);
    Task<IEnumerable<Train>>GetAllTrainsAsync();
    Task UpdateTrain(Train train);
    Task<bool> IsTrainNumberExistsAsync(string trainNumber);
    Task<bool> IsTrainNameExistsAsync(string trainName);

    Task<List<Train>> GetTrainsBetweenStationsAsync(int fromStationId, int toStationId);


    // Task<bool> IsTrainNumberExistsAsync(string trainNumber, int excludeTrainId);
    // Task<bool> IsTrainNameExistsAsync(string trainName, int excludeTrainId);


}