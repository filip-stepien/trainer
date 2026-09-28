import type { TrainingBlockRepository } from '../ports/training-block-repository';

export type ListTrainingBlocksParams = {
    coachId: string;
    clientId: string;
};

export function listTrainingBlocksFactory({
    trainingBlockRepository
}: {
    trainingBlockRepository: TrainingBlockRepository;
}) {
    return ({ coachId, clientId }: ListTrainingBlocksParams) =>
        trainingBlockRepository.findAll({ filter: { coachId, clientId } });
}
