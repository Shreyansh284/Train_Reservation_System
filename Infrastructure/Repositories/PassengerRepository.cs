using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class PassengerRepository(AppDbContext context):IPassengerRepository
{
    public async Task AddPassenger(Passenger passenger)
    {
        await context.Passengers.AddAsync(passenger);
    }

    public async Task<Passenger?> GetPassengerById(int id)
    {
        return await context.Passengers.FirstOrDefaultAsync(p=>p.PassengerId == id);
    }
    public async Task<IEnumerable<Passenger>> GetPassengerByBookingIdAsync(int id)
    {
        return await context.Passengers.Where(p => p.BookingId == id).ToListAsync();
    }
}