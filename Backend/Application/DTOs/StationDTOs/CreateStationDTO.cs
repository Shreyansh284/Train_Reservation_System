
namespace Application.DTOs.StationDTOs;

public class CreateStationDTO
{
    public string StationCode { get; set; }= null!;
    public string StationName { get; set; }= null!;
    public string City { get; set; }= null!;
    public string State { get; set; } = null!;
}