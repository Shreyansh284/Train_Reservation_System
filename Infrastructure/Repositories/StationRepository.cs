using Core.Interfaces;
using AutoMapper;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class StationRepository(AppDbContext context): IStationRepository
{
    public async Task<Station?> GetStationByCodeAsync(string stationCode)
    {
        return await context.Stations.FirstOrDefaultAsync(s=>s.StationCode==stationCode);
    }

    public async Task<Station> AddStationAsync(Station station)
    {
         await context.Stations.AddAsync(station);
         return station;
    }

}