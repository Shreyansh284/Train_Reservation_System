using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence;


    public class StationConfiguration : IEntityTypeConfiguration<Station>
    {
        public void Configure(EntityTypeBuilder<Station> builder)
        {
            // builder.HasQueryFilter(s => !s.IsDeleted);
            builder.HasIndex(s => s.StationCode).IsUnique();
            builder.HasIndex(s => s.StationName).IsUnique();
        }
    }