using Application.Exceptions;
using Core.Interfaces;
using MediatR;

namespace Application.Commands.TrainCommands;

public record ToggleTrainStatusCommand(int TrainId) : IRequest<bool>;
public class ToggleTrainStatusCommandHandler(
    ITrainRepository trainRepo,
    IUnitOfWork unitOfWork
) : IRequestHandler<ToggleTrainStatusCommand,bool>
{
    public async Task<bool> Handle(ToggleTrainStatusCommand request, CancellationToken cancellationToken)
    {
        var train = await trainRepo.GetTrainByIdAsync(request.TrainId);

        if (train == null)
            throw new NotFoundException($"Train not found.");

        train.IsActive=!train.IsActive;
        await trainRepo.UpdateTrain(train);
        await unitOfWork.SaveChangesAsync();

        return train.IsActive;
    }
}