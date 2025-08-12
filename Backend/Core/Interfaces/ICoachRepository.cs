using Core.Entities;

namespace Core.Interfaces;

public interface ICoachRepository
{
    Task AddCoachAsync(Coach coach);
    Task<Coach?> GetCoachByTrainIdAndCoachId(int trainId, int coachId);
    Task UpdateCoachAsync(Coach coach);
}