import type { ExerciseRepository } from '../ports/exercise-repository';

export type AddExerciseFromCatalogParams = {
    coachId: string;
    sourceExerciseId: string;
};

export function addExerciseFromCatalogFactory({
    exerciseRepository
}: {
    exerciseRepository: ExerciseRepository;
}) {
    return ({ coachId, sourceExerciseId }: AddExerciseFromCatalogParams) =>
        exerciseRepository.save({
            data: {
                coachId,
                sourceExerciseId,
                isCustom: false
            }
        });
}
