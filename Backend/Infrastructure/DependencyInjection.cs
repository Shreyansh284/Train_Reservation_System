using Core.Interfaces;
using Core.Options;
using Infrastructure.Data;
using Infrastructure.Helpers.TrainHelpers;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Application.Common.Interfaces;

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
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<IPassengerRepository, PassengerRepository>();
        services.AddScoped<IWaitingRepository, WaitingRepository>();
        services.AddScoped<ICancellationRepository, CancellationRepository>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IEmailService, EmailService>();

        services.AddScoped<ITrainMappingHelper, TrainMappingHelper>();

        // Add HTTP context accessor
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        return services;
    }
}