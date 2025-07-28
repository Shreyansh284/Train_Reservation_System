using Application.DTOs.TrainDTOs;
using FluentValidation;

namespace Application.Validators.TrainValidators;

public class SearchTrainRequestDTOValidator:AbstractValidator<SearchTrainRequestDTO>
{
    public SearchTrainRequestDTOValidator()
    {
        RuleFor(x => DateTime.Parse(x.DateOfBooking).Date)
            .GreaterThanOrEqualTo(DateTime.Today)
            .WithMessage("The booking date must be today or in the future.");
    }
}