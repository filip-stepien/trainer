import { ExerciseStatus } from '../../domain/exercise';
import type { ExerciseRepository } from '../ports/exercise-repository';

export type GetActiveExerciseParams = {
    coachId: string;
    exerciseId: string;
};

export function getActiveExerciseFactory({
    exerciseRepository
}: {
    exerciseRepository: ExerciseRepository;
}) {
    return ({ coachId, exerciseId }: GetActiveExerciseParams) =>
        exerciseRepository.findById({
            exerciseId,
            filter: { coachId, status: ExerciseStatus.Active }
        });
}
