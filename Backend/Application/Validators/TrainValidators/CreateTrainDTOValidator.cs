using Application.DTOs.CoachDTOs;
using Application.DTOs.TrainDTOs;
using Application.DTOs.TrainScheduleDTOs;
using Application.Validators.CoachValidators;
using Application.Validators.StationValidators;
using FluentValidation;

namespace Application.Validators.TrainValidators;
public class CreateTrainDTOValidator : AbstractValidator<CreateTrainDTO>
{
    public CreateTrainDTOValidator()
    {
        // Basic train info
        RuleFor(x => x.TrainNumber)
            .NotEmpty().WithMessage("Train number is required.");

        RuleFor(x => x.TrainName)
            .NotEmpty().WithMessage("Train name is required.");

        // Coaches validation
        RuleFor(x => x.Coaches)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Coaches field is required.")
            .NotEmpty().WithMessage("At least one coach is required.");

        RuleFor(x => x.Coaches)
            .Must(HaveAtLeastOneSL)
            .When(x => x.Coaches != null && x.Coaches.Count > 0)
            .WithMessage("At least one 'SL' coach class is required.");

        RuleForEach(x => x.Coaches)
            .SetValidator(new CreateCoachDTOValidator());

        // Stations validation
        RuleFor(x => x.Stations)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Stations list is required.")
            .Must(x => x.Count >= 2).WithMessage("At least two stations are required.");

        RuleFor(x => x.Stations)
            .Must(HaveUniqueStationNames)
            .When(x => x.Stations != null && x.Stations.Count > 1)
            .WithMessage("Station names must be unique.");

        RuleFor(x => x.Stations)
            .Must(ValidateIncreasingDistances)
            .When(x => x.Stations != null && x.Stations.Count > 1)
            .WithMessage("Station distances must start at 0 and strictly increase.");
    }

    private bool HaveAtLeastOneSL(List<CreateCoachDTO> coaches)
    {
        return coaches.Any(c => c.CoachClass.ToString() == "SL");
    }

    private bool HaveUniqueStationNames(List<CreateTrainScheduleDTO> schedules)
    {
        return schedules
            .Select(s => s.Station.StationName.Trim().ToLower())
            .Distinct()
            .Count() == schedules.Count;
    }

    private bool ValidateIncreasingDistances(List<CreateTrainScheduleDTO> schedules)
    {
        var ordered = schedules.OrderBy(s => s.DistanceFromSource).ToList();

        if (ordered.First().DistanceFromSource != 0)
            return false;

        for (int i = 1; i < ordered.Count; i++)
        {
            if (ordered[i].DistanceFromSource <= ordered[i - 1].DistanceFromSource)
                return false;
        }

        return true;
    }
}