using Core.Entities;

namespace Core.Interfaces;

public interface ISeatRepository
{
    Task AddSeatAsync(Seat seat);
}