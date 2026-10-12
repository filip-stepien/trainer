import { err } from '@/shared';

import { TrainingBlockErrorCode } from '../../domain/errors';
import type { TrainingDayExerciseRepository } from '../ports/training-day-exercise-repository';

export type SetTrainingDayExerciseLinkParams = {
    coachId: string;
    trainingBlockId: string;
    trainingDayId: string;
    trainingDayExerciseId: string;
    isLinkedToPrevious: boolean;
};

export function setTrainingDayExerciseLinkFactory({
    trainingDayExerciseRepository
}: {
    trainingDayExerciseRepository: TrainingDayExerciseRepository;
}) {
    return async ({
        coachId,
        trainingBlockId,
        trainingDayId,
        trainingDayExerciseId,
        isLinkedToPrevious
    }: SetTrainingDayExerciseLinkParams) => {
        const filter = { coachId, trainingBlockId, trainingDayId };
        const exercises = await trainingDayExerciseRepository.findAll({ filter });
        const current = exercises.find(exercise => exercise.id === trainingDayExerciseId);

        if (!current) {
            return err(TrainingBlockErrorCode.NotFound);
        }

        const sectionExercises = exercises.filter(exercise => exercise.section === current.section);
        const hasPrevious = sectionExercises.indexOf(current) > 0;

        return trainingDayExerciseRepository.updateAll({
            data: [
                {
                    trainingDayExerciseId: current.id,
                    position: current.position,
                    isLinkedToPrevious: isLinkedToPrevious && hasPrevious
                }
            ],
            filter
        });
    };
}
