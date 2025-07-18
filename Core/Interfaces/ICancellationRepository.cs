using Core.Entities;

namespace Core.Interfaces;

public interface ICancellationRepository
{
    Task AddCancellation(Cancellation cancellation);
}