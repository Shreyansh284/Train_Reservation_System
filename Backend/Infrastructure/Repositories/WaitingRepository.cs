using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class WaitingRepository(AppDbContext context):IWaitingRepository
{
    public async Task AddWaitlistEntryAsync(TrainWaitlist trainWaitlist)
    {
        await context.TrainWaitlists.AddAsync(trainWaitlist);
    }

    public async Task<IEnumerable<TrainWaitlist>> GetWaitlistedPassengerOfTrainByCoachClassAndDate(int trainId,DateTime bookingDate,
        string coachClass)
    {
        if (!Enum.TryParse<CoachClass>(coachClass, true, out var parsedCoachClass))
        {
            throw new ArgumentException("Invalid coach class value.");
        }

        return await context.TrainWaitlists
            .Where(w => w.TrainId == trainId
                        && w.CoachClass == parsedCoachClass
                        && w.JourneyDate == bookingDate)
            .ToListAsync();
    }

    public void DeleteWaitlistEntryAsync(TrainWaitlist trainWaitlist)
    {
         context.TrainWaitlists.Remove(trainWaitlist);
    }
}