using Application.DTOs.CoachDTOs;
using FluentValidation;

namespace Application.Validators.CoachValidators;
public class CreateCoachDTOValidator : AbstractValidator<CreateCoachDTO>
{
    public CreateCoachDTOValidator()
    {
        RuleFor(x=>x.CoachNumber).NotEmpty().WithMessage("Coach Number is Required");
        RuleFor(x => x.TotalSeats)
            .InclusiveBetween(10, 72)
            .WithMessage("TotalSeats must be between 10 and 72.");

        RuleFor(x => x.CoachClass)
            .NotNull()
            .WithMessage("CoachClass is required.");
    }
}