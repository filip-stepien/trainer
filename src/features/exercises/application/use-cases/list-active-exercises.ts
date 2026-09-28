import { ExerciseStatus } from '../../domain/exercise';
import type { ExerciseRepository } from '../ports/exercise-repository';

export type ListActiveExercisesParams = {
    coachId: string;
};

export function listActiveExercisesFactory({
    exerciseRepository
}: {
    exerciseRepository: ExerciseRepository;
}) {
    return ({ coachId }: ListActiveExercisesParams) =>
        exerciseRepository.findAll({ filter: { coachId, status: ExerciseStatus.Active } });
}
