using Core.Entities;

namespace Core.Interfaces;

public interface IStationRepository
{
    Task<Station?> GetStationByCodeAsync(string stationCode);
    Task<Station> AddStationAsync(Station station);
}