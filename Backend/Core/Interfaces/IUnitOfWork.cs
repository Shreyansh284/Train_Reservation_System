namespace Core.Interfaces;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync();
}