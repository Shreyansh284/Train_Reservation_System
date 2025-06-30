using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence;


    public class SeatConfiguration : IEntityTypeConfiguration<Seat>
    {
        public void Configure(EntityTypeBuilder<Seat> builder)
        {
            builder.HasOne(s => s.Coach)
                .WithMany(c => c.Seats)
                .HasForeignKey(s => s.CoachId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }