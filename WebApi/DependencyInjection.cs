using System.Text;
using Application;
using Core;
using Infrastructure;


namespace WebApi;

public static class DependencyInjection
{
    public static IServiceCollection AddAppDI(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor().AddApplicationDI().AddInfrastructureDI().AddCoreDI(configuration);

        return services;
    }
}