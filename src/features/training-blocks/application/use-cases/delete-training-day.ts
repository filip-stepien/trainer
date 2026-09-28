import type { TrainingDayRepository } from '../ports/training-day-repository';

export type DeleteTrainingDayParams = {
    coachId: string;
    trainingBlockId: string;
    trainingDayId: string;
};

export function deleteTrainingDayFactory({
    trainingDayRepository
}: {
    trainingDayRepository: TrainingDayRepository;
}) {
    return ({ coachId, trainingBlockId, trainingDayId }: DeleteTrainingDayParams) =>
        trainingDayRepository.deleteById({
            trainingDayId,
            filter: { coachId, trainingBlockId }
        });
}
