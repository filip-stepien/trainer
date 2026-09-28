import {
    normalizeTrainingDayExercisePrescription,
    type TrainingDayExercisePrescription
} from '../../domain/training-day-exercise';
import type { TrainingDayExerciseRepository } from '../ports/training-day-exercise-repository';

export type UpdateTrainingDayExerciseParams = {
    coachId: string;
    trainingBlockId: string;
    trainingDayId: string;
    trainingDayExerciseId: string;
    data: TrainingDayExercisePrescription;
};

export function updateTrainingDayExerciseFactory({
    trainingDayExerciseRepository
}: {
    trainingDayExerciseRepository: TrainingDayExerciseRepository;
}) {
    return ({
        coachId,
        trainingBlockId,
        trainingDayId,
        trainingDayExerciseId,
        data
    }: UpdateTrainingDayExerciseParams) =>
        trainingDayExerciseRepository.updateById({
            trainingDayExerciseId,
            data: normalizeTrainingDayExercisePrescription(data),
            filter: { coachId, trainingBlockId, trainingDayId }
        });
}
