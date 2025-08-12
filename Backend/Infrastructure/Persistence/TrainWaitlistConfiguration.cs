using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class TrainWaitlistConfiguration : IEntityTypeConfiguration<TrainWaitlist>
    {
        public void Configure(EntityTypeBuilder<TrainWaitlist> builder)
        {
            builder.HasOne(w => w.Train)
                .WithMany()
                .HasForeignKey(w => w.TrainId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(w => w.FromStation)
                .WithMany()
                .HasForeignKey(w => w.FromStationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(w => w.ToStation)
                .WithMany()
                .HasForeignKey(w => w.ToStationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(w => w.Passenger)
                .WithMany()
                .HasForeignKey(w => w.PassengerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(w => w.Booking)
                .WithMany()
                .HasForeignKey(w => w.BookingId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}