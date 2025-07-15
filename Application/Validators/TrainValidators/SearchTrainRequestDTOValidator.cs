using Application.DTOs.TrainDTOs;
using FluentValidation;

namespace Application.Validators.TrainValidators;

public class SearchTrainRequestDTOValidator:AbstractValidator<SearchTrainRequestDTO>
{
    public SearchTrainRequestDTOValidator()
    {
        RuleFor(x=>x.DateOfBooking).GreaterThanOrEqualTo(DateTime.Now)
            .WithMessage("The date must be today or in the future.");
    }
}