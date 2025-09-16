namespace Application.DTOs.CancellationDTOs;

public class CancellationRequestDTO
{
    public long PNR { get; set; }
    public List<int> PassengerIds { get; set; } = new();
    public string? Reason { get; set; }
}