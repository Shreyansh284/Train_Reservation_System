using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class SeatRepository(AppDbContext context):ISeatRepository
{
    public async Task AddSeatAsync(Seat seat)
    {
        await context.Seats.AddAsync(seat);
    }
}