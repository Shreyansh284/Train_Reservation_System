using Core.Entities;

namespace Core.Interfaces;

public interface ICoachRepository
{
    Task AddCoachAsync(Coach coach);
}