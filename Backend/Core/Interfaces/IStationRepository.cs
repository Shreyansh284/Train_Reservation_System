using Core.Entities;

namespace Core.Interfaces;

public interface IStationRepository
{
    Task<Station?> GetStationById(int stationId);

    Task<Station?> GetStationByCodeAsync(string stationCode);
    Task<Station> AddStationAsync(Station station);
    Task UpdateStationAsync(Station station);
    Task<IEnumerable<Station>> GetStationsByQueryAsync(string query);
}