using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence;
public class CoachConfiguration : IEntityTypeConfiguration<Coach>
{
    public void Configure(EntityTypeBuilder<Coach> builder)
    {
        builder.HasOne(c => c.Train)
            .WithMany(t => t.Coaches)
            .HasForeignKey(c => c.TrainId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}