
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence;

public class UserConfiguration:IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // builder.HasQueryFilter(u => !u.IsDeleted);
        builder.HasIndex(u => u.Email).IsUnique();
        builder.HasIndex(u => u.FullName).IsUnique();
        builder.HasIndex(u => u.Mobile).IsUnique();
    }
}