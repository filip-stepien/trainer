import { err, ok } from '@/shared';

import { ExerciseErrorCode } from '../../domain/errors';
import type { ExerciseRepository } from '../ports/exercise-repository';

export type GetExerciseParams = {
    coachId: string;
    exerciseId: string;
};

export function getExerciseFactory({
    exerciseRepository
}: {
    exerciseRepository: ExerciseRepository;
}) {
    return async ({ coachId, exerciseId }: GetExerciseParams) => {
        const exercise = await exerciseRepository.findById({
            exerciseId,
            filter: { coachId }
        });
        return exercise ? ok(exercise) : err(ExerciseErrorCode.NotFound);
    };
}
