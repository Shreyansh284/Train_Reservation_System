using System.ComponentModel.DataAnnotations;
using Core.Enums;
namespace Core.Entities;

public class User
{
    [Key]
    public int UserId { get; set; }

    [MaxLength(200)] public string FullName { get; set; } = null!;

    [MaxLength(200)] public string Email { get; set; } = null!;

    [MaxLength(15)] public string Mobile { get; set; } = null!;

    [MaxLength(256)] public string PasswordHash { get; set; } = null!;

    [MaxLength(12)]
    public string? AadhaarNumber { get; set; }

    public GenderType? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public UserRole UserRole { get; set; } = UserRole.Customer;
    public DateTime CreatedAt { get; set; }=DateTime.Now;
    public bool IsActive { get; set; } = true;

    public ICollection<Booking>? Bookings { get; set; }
}