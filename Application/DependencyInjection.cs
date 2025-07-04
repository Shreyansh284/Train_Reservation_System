using Application.DTOs.CoachDTOs;
using Application.DTOs.StationDTOs;
using Application.DTOs.TrainDTOs;
using Application.Validators.TrainValidators;
using Core.Interfaces;
 using Application.Validators.StationValidators;
 using Application.Validators.TrainSchedulesValidators;
 using Application.Validators.CoachValidators;

using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.DependencyInjection;
namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationDI(this IServiceCollection services)
    {     services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);
        });
        services.AddAutoMapper(typeof(DependencyInjection).Assembly);
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
        services.AddFluentValidationAutoValidation();
        return services;
    }
}