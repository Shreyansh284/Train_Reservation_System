using Application.DTOs.TrainDTOs;
using Core.Interfaces;
using FluentValidation;

namespace Application.Validators.TrainValidators;

public class EditTrainDetailsDTOValidator:AbstractValidator<EditTrainDetailsDTO>
{
    private readonly ITrainRepository _trainRepository;


        public EditTrainDetailsDTOValidator(ITrainRepository trainRepository)
        {
            _trainRepository = trainRepository;
            RuleFor(x => x.TrainNumber)
                .NotEmpty()
                .When(x => x.TrainNumber != null);

            RuleFor(x => x.TrainName)
                .NotEmpty()
                .When(x => x.TrainName != null);

        }
        private async Task<bool> IsTrainNumberUnique(string trainNumber, CancellationToken ct)
        {
            return !await _trainRepository.IsTrainNumberExistsAsync(trainNumber);
        }
        private async Task<bool> IsTrainNameUnique(string trainName, CancellationToken ct)
        {
            return !await _trainRepository.IsTrainNameExistsAsync(trainName);
        }

    }