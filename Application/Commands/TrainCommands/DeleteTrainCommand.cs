using Application.Exceptions;
using Core.Interfaces;
using MediatR;

namespace Application.Commands.TrainCommands;

public record DeleteTrainCommand(string TrainNumber) : IRequest;
public class DeleteTrainCommandHandler(
    ITrainRepository trainRepo,
    IUnitOfWork unitOfWork
) : IRequestHandler<DeleteTrainCommand>
{
    public async Task Handle(DeleteTrainCommand request, CancellationToken cancellationToken)
    {
        var train = await trainRepo.GetTrainByNumberAsync(request.TrainNumber);

        if (train == null)
            throw new NotFoundException($"Train with number {request.TrainNumber} not found.");

        train.IsDeleted = true;
        await trainRepo.DeleteTrainAsync(train);
        await unitOfWork.SaveChangesAsync();
    }
}