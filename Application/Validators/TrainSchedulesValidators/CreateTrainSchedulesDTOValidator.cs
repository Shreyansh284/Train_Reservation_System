using Application.DTOs.TrainScheduleDTOs;
using Application.Validators.StationValidators;
using FluentValidation;

namespace Application.Validators.TrainSchedulesValidators;

public class CreateTrainSchedulesDTOValidator:AbstractValidator<CreateTrainScheduleDTO>
{
    public CreateTrainSchedulesDTOValidator()
    {
        RuleFor(x=>x.Station).NotNull().NotEmpty().WithMessage("Station is required.");
        RuleFor(x=>x.Station).SetValidator(new CreateStationDTOValidator());

        RuleFor(x=>x.DistanceFromSource).NotNull().NotEmpty().WithMessage("Distance from source is required.");

    }
}