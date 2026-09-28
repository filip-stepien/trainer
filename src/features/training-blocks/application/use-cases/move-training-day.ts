import { err, ok } from '@/shared';

import { TrainingDayMoveDirection } from '../../domain/training-day';
import { TrainingBlockErrorCode } from '../../domain/errors';
import type { TrainingDayRepository } from '../ports/training-day-repository';

export type MoveTrainingDayParams = {
    coachId: string;
    trainingBlockId: string;
    trainingDayId: string;
    direction: TrainingDayMoveDirection;
};

export function moveTrainingDayFactory({
    trainingDayRepository
}: {
    trainingDayRepository: TrainingDayRepository;
}) {
    return async ({
        coachId,
        trainingBlockId,
        trainingDayId,
        direction
    }: MoveTrainingDayParams) => {
        const filter = { coachId, trainingBlockId };
        const trainingDays = await trainingDayRepository.findAll({ filter });
        const currentIndex = trainingDays.findIndex(
            trainingDay => trainingDay.id === trainingDayId
        );

        if (currentIndex < 0) {
            return err(TrainingBlockErrorCode.NotFound);
        }

        const offset = direction === TrainingDayMoveDirection.Up ? -1 : 1;
        const target = trainingDays[currentIndex + offset];
        const current = trainingDays[currentIndex];

        if (!current || !target) {
            return ok(trainingDays);
        }

        return trainingDayRepository.updateAll({
            data: [
                { trainingDayId: current.id, position: target.position },
                { trainingDayId: target.id, position: current.position }
            ],
            filter
        });
    };
}
