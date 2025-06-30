using System.ComponentModel.DataAnnotations;

namespace Core.Entities;

public class Station
{
    [Key]
    public int StationId { get; set; }

    [MaxLength(10)]
    public string StationCode { get; set; }= null!;

    [MaxLength(200)]
    public string StationName { get; set; }= null!;

    [MaxLength(100)]
    public string City { get; set; }= null!;

    [MaxLength(100)] public string State { get; set; } = null!;

    public bool IsDeleted { get; set; } = false;
}