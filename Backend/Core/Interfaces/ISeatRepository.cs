using Core.Entities;

namespace Core.Interfaces;

public interface ISeatRepository
{
    Task AddSeatAsync(Seat seat);
    // Task<int>CountAvailableSeatsAsync(int coachId, DateTime dateOfBooking);
    Task<List<Seat>> GetAvailableSeatsAsync(int coachId, DateTime journeyDate, int fromStationId,
        int toStationId);

}