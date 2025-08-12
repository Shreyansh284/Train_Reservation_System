using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class SeatRepository(AppDbContext context):ISeatRepository
{
    public async Task AddSeatAsync(Seat seat)
    {
        await context.Seats.AddAsync(seat);
    }
    // public async Task<List<Seat>> GetAvailableSeatsAsync(int coachId, DateTime journeyDate)
    // {
    //     // Get the list of booked seat IDs for this coach and date
    //     var bookedSeatIds = await context.Passengers
    //         .Where(p =>
    //             p.Seat != null &&
    //             p.Seat.CoachId == coachId &&
    //             p.Booking.JourneyDate.Date == journeyDate.Date &&
    //             p.Booking.BookingStatus != BookingStatus.Cancelled)
    //         .Select(p => p.SeatId)
    //         .ToListAsync();
    //
    //     // Get available seats by excluding booked ones
    //     var availableSeats = await context.Seats
    //         .Where(s => s.CoachId == coachId && !bookedSeatIds.Contains(s.SeatId))
    //         .ToListAsync();
    //
    //     return availableSeats;
    // }
public async Task<List<Seat>> GetAvailableSeatsAsync(
    int coachId,
    DateTime journeyDate,
    int fromStationId,
    int toStationId)
{
    // 1. Get station distances (once)
    var trainStationDistances = await context.TrainSchedules
        .Where(ts => ts.Train.Coaches.Any(c => c.CoachId == coachId))
        .ToListAsync();

    var fromStation = trainStationDistances.FirstOrDefault(s => s.StationId == fromStationId);
    var toStation = trainStationDistances.FirstOrDefault(s => s.StationId == toStationId);

    if (fromStation == null || toStation == null)
        throw new Exception("Invalid station(s)");

    double requestedFrom = fromStation.DistanceFromSource;
    double requestedTo = toStation.DistanceFromSource;

    if (requestedFrom >= requestedTo)
        throw new ArgumentException("Invalid segment: fromStation must be before toStation");

    // 2. Get all seats in this coach
    var allSeats = await context.Seats
        .Where(s => s.CoachId == coachId)
        .AsNoTracking().ToListAsync();

    var availableSeats = new List<Seat>();

    foreach (var seat in allSeats)
    {
        // 3. Find all passengers on this seat and date, whose bookings are active
        var passengerBookings = await context.Passengers
            .Include(p => p.Booking)
            .Where(p =>
                p.SeatId == seat.SeatId &&
                p.Booking.JourneyDate.Date == journeyDate.Date &&
                p.Booking.BookingStatus != BookingStatus.Cancelled)
            .Select(p => new
            {
                p.Booking.FromStationId,
                p.Booking.ToStationId
            })
            .AsNoTracking().ToListAsync();

        // 4. Assume seat is free unless proven overlapping
        bool isAvailable = true;

        foreach (var b in passengerBookings)
        {
            var bookedFrom = trainStationDistances.First(s => s.StationId == b.FromStationId).DistanceFromSource;
            var bookedTo = trainStationDistances.First(s => s.StationId == b.ToStationId).DistanceFromSource;

            // 🛠️ FIXED OVERLAP CHECK: Edge-touch is allowed
            if (!(requestedFrom >= bookedTo || requestedTo <= bookedFrom))
            {
                isAvailable = false;
                break;
            }
        }

        if (isAvailable)
            availableSeats.Add(seat);
    }

    return availableSeats;
}

}