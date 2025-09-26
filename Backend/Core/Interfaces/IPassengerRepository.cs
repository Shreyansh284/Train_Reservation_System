using Core.Entities;

namespace Core.Interfaces;

public interface IPassengerRepository
{
    Task AddPassengers(List<Passenger> passengers);
    Task<IEnumerable<Passenger>> GetPassengerByBookingIdAsync(int id);
    Task<Passenger?>GetPassengerById(int id);
}