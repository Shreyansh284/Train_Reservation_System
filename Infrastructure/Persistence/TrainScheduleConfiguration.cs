using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence;

public class TrainScheduleConfiguration : IEntityTypeConfiguration<TrainSchedule>
{
    public void Configure(EntityTypeBuilder<TrainSchedule> builder)
    {
        builder.HasIndex(ts => new { ts.TrainId, ts.StationId }).IsUnique();

        builder.HasOne(ts => ts.Train)
            .WithMany(t => t.Schedules)
            .HasForeignKey(ts => ts.TrainId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ts => ts.Station)
            .WithMany()
            .HasForeignKey(ts => ts.StationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}