import { err, ok } from '@/shared';

import { TrainingBlockErrorCode } from '../../domain/errors';
import type { TrainingBlockRepository } from '../ports/training-block-repository';

export type GetTrainingBlockParams = {
    coachId: string;
    trainingBlockId: string;
};

export function getTrainingBlockFactory({
    trainingBlockRepository
}: {
    trainingBlockRepository: TrainingBlockRepository;
}) {
    return async ({ coachId, trainingBlockId }: GetTrainingBlockParams) => {
        const trainingBlock = await trainingBlockRepository.findById({
            trainingBlockId,
            filter: { coachId }
        });

        return trainingBlock ? ok(trainingBlock) : err(TrainingBlockErrorCode.NotFound);
    };
}
