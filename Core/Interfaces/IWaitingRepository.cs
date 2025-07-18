using Core.Entities;
using Core.Enums;

namespace Core.Interfaces;

public interface IWaitingRepository
{
    Task AddWaitlistEntryAsync(TrainWaitlist trainWaitlist);
    Task<IEnumerable<TrainWaitlist>> GetWaitlistedPassengerOfTrainByCoachClassAndDate(int trainId, DateTime bookingDate,
        string coachClass);

    void DeleteWaitlistEntryAsync(TrainWaitlist trainWaitlist);
}