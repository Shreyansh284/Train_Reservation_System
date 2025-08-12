using Core.Interfaces;
using AutoMapper;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class StationRepository(AppDbContext context): IStationRepository
{
    public async Task<Station?> GetStationById(int stationId)
    {
        return await context.Stations.FirstOrDefaultAsync(s=>s.StationId==stationId);
    }
    public async Task<Station?> GetStationByCodeAsync(string stationCode)
    {
        return await context.Stations.FirstOrDefaultAsync(s=>s.StationCode==stationCode);
    }

    public async Task<IEnumerable<Station>> GetStationsByQueryAsync(string query)
    {
        return await context.Stations
            .Where(s => s.StationName.Contains(query))
            .OrderBy(s => s.StationName)
            .ToListAsync();
    }

    public async Task<Station> AddStationAsync(Station station)
    {
         await context.Stations.AddAsync(station);
         return station;
    }

    public async Task UpdateStationAsync(Station station)
    {
         context.Stations.Update(station);
    }

}