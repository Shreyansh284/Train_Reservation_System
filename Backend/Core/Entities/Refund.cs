using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Enums;

namespace Core.Entities;

public class Refund
{
    [Key]
    public int RefundId { get; set; }

    [ForeignKey("CancellationId")]
    public int CancellationId { get; set; }
    public Cancellation Cancellation { get; set; } = null!;

    public RefundStatus RefundStatus { get; set; } = RefundStatus.Pending;
    public DateTime? RefundedOn { get; set; }

    [MaxLength(50)]
    public string? RefundMode { get; set; } = null!;

    [MaxLength(100)]
    public string? TransactionId { get; set; } = null!;
    public string? Notes { get; set; } = null!;
}