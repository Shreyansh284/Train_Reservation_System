using AutoMapper;
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
        // Get distance for from/to stations
        var trainStationDistances = await context.TrainSchedules
            .Where(ts => ts.Train.Coaches.Any(c => c.CoachId == coachId))
            .ToDictionaryAsync(ts => ts.StationId, ts => ts.DistanceFromSource);

        double requestedFromDistance = trainStationDistances[fromStationId];
        double requestedToDistance = trainStationDistances[toStationId];

        // Ensure correct direction
        if (requestedFromDistance >= requestedToDistance)
            throw new ArgumentException("Invalid station order: fromStation must be before toStation");

        // Get all seats in the coach
        var allSeats = await context.Seats
            .Where(s => s.CoachId == coachId)
            .ToListAsync();

        var availableSeats = new List<Seat>();

        foreach (var seat in allSeats)
        {
            var bookings = await context.Passengers
                .Where(p => p.SeatId == seat.SeatId &&
                            p.Booking.JourneyDate.Date == journeyDate.Date &&
                            p.Booking.BookingStatus != BookingStatus.Cancelled)
                .Select(p => new
                {
                    p.Booking.FromStationId,
                    p.Booking.ToStationId
                })
                .ToListAsync();

            bool isAvailable = true;

            foreach (var b in bookings)
            {
                double bookedFrom = trainStationDistances[b.FromStationId];
                double bookedTo = trainStationDistances[b.ToStationId];

                // Overlap logic using distances
                if (!(requestedToDistance <= bookedFrom || requestedFromDistance >= bookedTo))
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