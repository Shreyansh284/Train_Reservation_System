
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Infrastructure.Persistence;
public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {

        builder.Property(b => b.PNR)
            .HasColumnType("BIGINT")
            .HasDefaultValueSql("NEXT VALUE FOR dbo.PNRSequence");

        builder.Property(b => b.TotalFare)
            .HasPrecision(18, 2);

        builder.HasOne(b => b.User)
            .WithMany(u => u.Bookings)
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.Train)
            .WithMany()
            .HasForeignKey(b => b.TrainId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.FromStation)
            .WithMany()
            .HasForeignKey(b => b.FromStationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.ToStation)
            .WithMany()
            .HasForeignKey(b => b.ToStationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}