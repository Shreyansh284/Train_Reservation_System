using Core.Entities;

namespace Core.Interfaces;

public interface IPassengerRepository
{
    Task AddPassenger(Passenger passenger);
    Task<IEnumerable<Passenger>> GetPassengerByBookingIdAsync(int id);
    Task<Passenger?>GetPassengerById(int id);
}