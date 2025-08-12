using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.SeatDTOs;

public class AddSeatDTO
{
    public int CoachId { get; set; }
    public string SeatNumber { get; set; } = null!;
}