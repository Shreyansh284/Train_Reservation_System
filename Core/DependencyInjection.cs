using Core.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Core;

public static class DependencyInjection
{
    public static IServiceCollection AddCoreDI(this IServiceCollection services,IConfiguration configuration)
    {
        services.Configure<ConnectionString>(configuration.GetSection(ConnectionString.SectionName));
        return services;
    }
}