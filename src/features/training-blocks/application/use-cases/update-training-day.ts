import { normalizeTrainingDayData, type TrainingDayData } from '../../domain/training-day';
import type { TrainingDayRepository } from '../ports/training-day-repository';

export type UpdateTrainingDayParams = {
    coachId: string;
    trainingBlockId: string;
    trainingDayId: string;
    data: TrainingDayData;
};

export function updateTrainingDayFactory({
    trainingDayRepository
}: {
    trainingDayRepository: TrainingDayRepository;
}) {
    return ({ coachId, trainingBlockId, trainingDayId, data }: UpdateTrainingDayParams) =>
        trainingDayRepository.updateById({
            trainingDayId,
            data: normalizeTrainingDayData(data),
            filter: { coachId, trainingBlockId }
        });
}
