import { err } from '@/shared';

import { TrainingBlockErrorCode } from '../../domain/errors';
import {
    normalizeTrainingDayExercisePrescription,
    type TrainingDayExercisePrescription,
    type TrainingDayExerciseSection
} from '../../domain/training-day-exercise';
import type { ExerciseLibrary } from '../ports/exercise-library';
import type { TrainingDayExerciseRepository } from '../ports/training-day-exercise-repository';

export type AddTrainingDayExerciseData = TrainingDayExercisePrescription & {
    exerciseId: string;
    section: TrainingDayExerciseSection;
};

export type AddTrainingDayExerciseParams = {
    coachId: string;
    trainingBlockId: string;
    trainingDayId: string;
    data: AddTrainingDayExerciseData;
};

export function addTrainingDayExerciseFactory({
    exerciseLibrary,
    trainingDayExerciseRepository
}: {
    exerciseLibrary: ExerciseLibrary;
    trainingDayExerciseRepository: TrainingDayExerciseRepository;
}) {
    return async ({
        coachId,
        trainingBlockId,
        trainingDayId,
        data
    }: AddTrainingDayExerciseParams) => {
        const exercise = await exerciseLibrary.findActiveById({
            coachId,
            exerciseId: data.exerciseId
        });

        if (!exercise) {
            return err(TrainingBlockErrorCode.ExerciseNotFound);
        }

        return trainingDayExerciseRepository.save({
            data: {
                ...normalizeTrainingDayExercisePrescription(data),
                exerciseId: exercise.id,
                section: data.section,
                name: exercise.name,
                instructions: exercise.instructions,
                videoUrl: exercise.videoUrl
            },
            filter: { coachId, trainingBlockId, trainingDayId }
        });
    };
}
