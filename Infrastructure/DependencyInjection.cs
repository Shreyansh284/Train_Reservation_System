// using Application.Interfaces;

using Core.Interfaces;
using Core.Options;
using Infrastructure.Data;
using Infrastructure.Repositories;
// using Infrastructure.Repositories;
// using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureDI(this IServiceCollection services)
    {
        services.AddDbContext<AppDbContext>((provider,options) =>
            options.UseSqlServer(provider.GetRequiredService<IOptionsSnapshot<ConnectionString>>().Value.DefaultConnection));
        services.AddScoped<ITrainRepository, TrainRepository>();
        services.AddScoped<IStationRepository, StationRepository>();
        services.AddScoped<ICoachRepository, CoachRepository>();
        services.AddScoped<ITrainScheduleRepository, TrainScheduleRepository>();
        services.AddScoped<ISeatRepository, SeatRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}