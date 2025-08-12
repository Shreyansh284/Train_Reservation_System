using Application.DTOs.TrainDTOs;
using Application.Exceptions;
using AutoMapper;
using Core.Interfaces;
using MediatR;

namespace Application.Commands.TrainCommands;

public record EditTrainDetailsCommand(int TrainId,EditTrainDetailsDTO Dto) : IRequest<DisplayTrainDTO>;

public class EditTrainDetailsCommandHandler(IMapper mapper,ITrainRepository trainRepository,IUnitOfWork unitOfWork):IRequestHandler<EditTrainDetailsCommand, DisplayTrainDTO>
{
    public async Task<DisplayTrainDTO> Handle(EditTrainDetailsCommand request, CancellationToken cancellationToken)
    {
        var train = await trainRepository.GetTrainByIdAsync(request.TrainId);
        if (train == null)
        {
            throw new NotFoundException("Train not found.");
        }

        if (request.Dto.TrainNumber != null)
        {
            train.TrainNumber = request.Dto.TrainNumber;
        }

        if (request.Dto.TrainName != null)
        {
            train.TrainName = request.Dto.TrainName;
        }
        await trainRepository.UpdateTrain(train);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<DisplayTrainDTO>(train);
    }
}