using Application.Exceptions;
using Core.Interfaces;
using MediatR;

namespace Application.Commands.TrainCommands;

public record ToggleTrainCoachCommand(int TrainId,int CoachId) : IRequest<bool>;
public class ToggleTrainCoachCommandHandler(
    ITrainRepository trainRepo,
    ICoachRepository coachRepo,
    IUnitOfWork unitOfWork
) : IRequestHandler<ToggleTrainCoachCommand,bool>
{
    public async Task<bool> Handle(ToggleTrainCoachCommand request, CancellationToken cancellationToken)
    {
        var train = await trainRepo.GetTrainByIdAsync(request.TrainId);
        if (train == null)
            throw new NotFoundException($"Train not found.");
        var coach=await coachRepo.GetCoachByTrainIdAndCoachId(request.TrainId,request.CoachId);

        if (coach == null)
        {
            throw new NotFoundException($"Coach not found for this train");
        }
        coach.IsActive = !coach.IsActive;
        await coachRepo.UpdateCoachAsync(coach);
        await unitOfWork.SaveChangesAsync();

        return coach.IsActive;
    }
}