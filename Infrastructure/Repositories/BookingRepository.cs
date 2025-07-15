using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class BookingRepository(AppDbContext context):IBookingRepository
{
    public async Task AddBooking(Booking booking)
    {
        await context.Bookings.AddAsync(booking);
    }

    public async Task<Booking?> GetBookingWithDetailsByPNR(long PNR)
    {
            return await context.Bookings
                .Include(b => b.Train)
                .Include(b => b.FromStation)
                .Include(b => b.ToStation)
                .Include(b => b.Passengers)
                .ThenInclude(p => p.Seat)
                .ThenInclude(s => s.Coach)
                .SingleOrDefaultAsync(b => b.PNR==PNR);
    }
}