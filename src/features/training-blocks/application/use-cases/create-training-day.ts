import { normalizeTrainingDayData, type TrainingDayData } from '../../domain/training-day';
import type { TrainingDayRepository } from '../ports/training-day-repository';

export type CreateTrainingDayParams = {
    coachId: string;
    trainingBlockId: string;
    data: TrainingDayData;
};

export function createTrainingDayFactory({
    trainingDayRepository
}: {
    trainingDayRepository: TrainingDayRepository;
}) {
    return ({ coachId, trainingBlockId, data }: CreateTrainingDayParams) =>
        trainingDayRepository.save({
            data: normalizeTrainingDayData(data),
            filter: { coachId, trainingBlockId }
        });
}
