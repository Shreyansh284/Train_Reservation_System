using System.ComponentModel.DataAnnotations;

namespace Core.Entities;

public class Cancellation
{
    [Key]
    public int CancellationId { get; set; }

    public int BookingId { get; set; }
    public Booking Booking { get; set; } = null!;

    public int CancelledByUserId { get; set; }
    public User CancelledByUser { get; set; } = null!;

    public DateTime CancelledOn { get; set; } = DateTime.UtcNow;

    [MaxLength(200)]
    public string? Reason { get; set; } = null!;
    public decimal TotalRefundAmount { get; set; } = 0;

    public Refund? Refund { get; set; }
}