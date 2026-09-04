import type { ExerciseStatus } from '../../domain/exercise';
import type { ExerciseRepository } from '../ports/exercise-repository';

export type SetExerciseStatusParams = {
    coachId: string;
    exerciseId: string;
    status: ExerciseStatus;
};

export function setExerciseStatusFactory({
    exerciseRepository
}: {
    exerciseRepository: ExerciseRepository;
}) {
    return ({ coachId, exerciseId, status }: SetExerciseStatusParams) =>
        exerciseRepository.updateStatusById({
            exerciseId,
            filter: { coachId },
            status
        });
}
