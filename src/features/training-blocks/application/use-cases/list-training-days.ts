import type { TrainingDayRepository } from '../ports/training-day-repository';

export type ListTrainingDaysParams = {
    coachId: string;
    trainingBlockId: string;
};

export function listTrainingDaysFactory({
    trainingDayRepository
}: {
    trainingDayRepository: TrainingDayRepository;
}) {
    return ({ coachId, trainingBlockId }: ListTrainingDaysParams) =>
        trainingDayRepository.findAll({ filter: { coachId, trainingBlockId } });
}
