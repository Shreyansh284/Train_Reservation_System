using Core.Entities;

namespace Core.Interfaces;

public interface ITrainRepository
{
    Task AddTrainAsync(Train train);
    Task<Train?> GetTrainByNumberAsync(string trainNumber);
    Task<IEnumerable<Train>>GetAllTrainsAsync();
    Task DeleteTrainAsync(Train train);
}