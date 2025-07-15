using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class PassengerRepository(AppDbContext context):IPassengerRepository
{
    public async Task AddPassenger(Passenger passenger)
    {
        await context.Passengers.AddAsync(passenger);
    }
}