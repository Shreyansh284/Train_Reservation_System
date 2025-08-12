using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence;
public class TrainConfiguration : IEntityTypeConfiguration<Train>
{
    public void Configure(EntityTypeBuilder<Train> builder)
    {
        // builder.HasQueryFilter(t => !t.IsDeleted);
        builder.HasIndex(t => t.TrainNumber).IsUnique();
        builder.HasOne(t => t.SourceStation)
            .WithMany()
            .HasForeignKey(t => t.SourceStationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.DestinationStation)
            .WithMany()
            .HasForeignKey(t => t.DestinationStationId)
            .OnDelete(DeleteBehavior.Restrict);

    }
}