using Core.Entities;

namespace Core.Interfaces;

public interface IPassengerRepository
{
    Task AddPassenger(Passenger passenger);
}