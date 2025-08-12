using Application.DTOs.StationDTOs;
using FluentValidation;

namespace Application.Validators.StationValidators;

public class CreateStationDTOValidator: AbstractValidator<CreateStationDTO>
{
    public CreateStationDTOValidator()
    {
        RuleFor(x => x.StationName)
            .NotEmpty()
            .WithMessage("Station name is required.");

        RuleFor(x => x.StationCode)
            .NotEmpty()
            .WithMessage("Station code is required.");


        RuleFor(x=>x.City).NotEmpty().NotNull().WithMessage("City is required.");
        RuleFor(x=>x.State).NotEmpty().NotNull().WithMessage("State is required.");
    }
}