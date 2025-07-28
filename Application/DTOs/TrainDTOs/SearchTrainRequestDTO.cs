namespace Application.DTOs.TrainDTOs;

public class SearchTrainRequestDTO
{
    public int FromStationId { get; set; }
    public int ToStationId{ get; set; }
    public string DateOfBooking{ get; set; }
}