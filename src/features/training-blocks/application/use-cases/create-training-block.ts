import { normalizeTrainingBlockData, type TrainingBlockData } from '../../domain/training-block';
import type { TrainingBlockRepository } from '../ports/training-block-repository';

export type CreateTrainingBlockParams = {
    coachId: string;
    clientId: string;
    data: TrainingBlockData;
};

export function createTrainingBlockFactory({
    trainingBlockRepository
}: {
    trainingBlockRepository: TrainingBlockRepository;
}) {
    return ({ coachId, clientId, data }: CreateTrainingBlockParams) =>
        trainingBlockRepository.save({
            coachId,
            clientId,
            data: normalizeTrainingBlockData(data)
        });
}
