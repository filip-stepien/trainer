import { err, ok } from '@/shared';

import { TrainingBlockErrorCode } from '../../domain/errors';
import { TrainingDayExerciseMoveDirection } from '../../domain/training-day-exercise';
import type { TrainingDayExerciseRepository } from '../ports/training-day-exercise-repository';

export type MoveTrainingDayExerciseParams = {
    coachId: string;
    trainingBlockId: string;
    trainingDayId: string;
    trainingDayExerciseId: string;
    direction: TrainingDayExerciseMoveDirection;
};

export function moveTrainingDayExerciseFactory({
    trainingDayExerciseRepository
}: {
    trainingDayExerciseRepository: TrainingDayExerciseRepository;
}) {
    return async ({
        coachId,
        trainingBlockId,
        trainingDayId,
        trainingDayExerciseId,
        direction
    }: MoveTrainingDayExerciseParams) => {
        const filter = { coachId, trainingBlockId, trainingDayId };
        const exercises = await trainingDayExerciseRepository.findAll({ filter });
        const current = exercises.find(exercise => exercise.id === trainingDayExerciseId);

        if (!current) {
            return err(TrainingBlockErrorCode.NotFound);
        }

        const sectionExercises = exercises.filter(exercise => exercise.section === current.section);
        const currentIndex = sectionExercises.findIndex(exercise => exercise.id === current.id);
        const offset = direction === TrainingDayExerciseMoveDirection.Up ? -1 : 1;
        const target = sectionExercises[currentIndex + offset];

        if (!target) {
            return ok(sectionExercises);
        }

        return trainingDayExerciseRepository.updateAll({
            data: [
                { trainingDayExerciseId: current.id, position: target.position },
                { trainingDayExerciseId: target.id, position: current.position }
            ],
            filter
        });
    };
}
