using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class PassengerRepository(AppDbContext context):IPassengerRepository
{
    public async Task AddPassengers(List<Passenger> passengers)
    {
        await context.Passengers.AddRangeAsync(passengers);
    }

    public async Task<Passenger?> GetPassengerById(int id)
    {
        return await context.Passengers
                        .Include(p => p.Booking)
                            .ThenInclude(b => b.Train)
                        .FirstOrDefaultAsync(p => p.PassengerId == id);

    }
    public async Task<IEnumerable<Passenger>> GetPassengerByBookingIdAsync(int id)
    {
        return await context.Passengers.Where(p => p.BookingId == id).ToListAsync();
    }
}