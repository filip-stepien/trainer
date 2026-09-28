import { normalizeTrainingBlockData, type TrainingBlockData } from '../../domain/training-block';
import type { TrainingBlockRepository } from '../ports/training-block-repository';

export type UpdateTrainingBlockParams = {
    coachId: string;
    trainingBlockId: string;
    data: TrainingBlockData;
};

export function updateTrainingBlockFactory({
    trainingBlockRepository
}: {
    trainingBlockRepository: TrainingBlockRepository;
}) {
    return ({ coachId, trainingBlockId, data }: UpdateTrainingBlockParams) =>
        trainingBlockRepository.updateById({
            trainingBlockId,
            data: normalizeTrainingBlockData(data),
            filter: { coachId }
        });
}
