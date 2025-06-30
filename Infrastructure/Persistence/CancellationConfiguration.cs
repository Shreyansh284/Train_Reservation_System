
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Infrastructure.Persistence;

public class CancellationConfiguration : IEntityTypeConfiguration<Cancellation>
{
    public void Configure(EntityTypeBuilder<Cancellation> builder)
    {
        builder.Property(c => c.TotalRefundAmount)
            .HasPrecision(18, 2);

        builder.HasOne(c => c.Booking)
            .WithOne(b => b.Cancellation)
            .HasForeignKey<Cancellation>(c => c.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.CancelledByUser)
            .WithMany()
            .HasForeignKey(c => c.CancelledByUserId)
            .OnDelete(DeleteBehavior.Restrict);

    }
}