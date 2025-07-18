using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class CancellationRepository(AppDbContext context):ICancellationRepository
{
    public async Task AddCancellation(Cancellation cancellation)
    {
        await context.Cancellations.AddAsync(cancellation);
    }

}