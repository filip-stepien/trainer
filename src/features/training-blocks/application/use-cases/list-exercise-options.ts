import type { ExerciseLibrary } from '../ports/exercise-library';

export type ListExerciseOptionsParams = {
    coachId: string;
};

export function listExerciseOptionsFactory({
    exerciseLibrary
}: {
    exerciseLibrary: ExerciseLibrary;
}) {
    return ({ coachId }: ListExerciseOptionsParams) => exerciseLibrary.findAllActive({ coachId });
}
