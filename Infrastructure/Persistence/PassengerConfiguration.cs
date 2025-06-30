using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence;
public class PassengerConfiguration : IEntityTypeConfiguration<Passenger>
{
    public void Configure(EntityTypeBuilder<Passenger> builder)
    {
        builder.HasOne(p => p.Booking)
            .WithMany(b => b.Passengers)
            .HasForeignKey(p => p.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Coach)
            .WithMany()
            .HasForeignKey(p => p.CoachId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.Seat)
            .WithMany()
            .HasForeignKey(p => p.SeatId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}