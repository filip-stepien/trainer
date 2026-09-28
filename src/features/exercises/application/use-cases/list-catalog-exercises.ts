import { createPage, getPagePagination } from '@/shared';

import { ExerciseStatus, type Exercise } from '../../domain/exercise';
import type { ExerciseRepository } from '../ports/exercise-repository';

export type ListCatalogExercisesParams = {
    coachId: string;
    page: number;
    pageSize: number;
    search: string;
};

export type CatalogExercise = {
    exercise: Exercise;
    libraryExercise: Exercise | null;
};

function toCatalogExercise({
    exercise,
    libraryExercisesBySourceId
}: {
    exercise: Exercise;
    libraryExercisesBySourceId: Map<string | null, Exercise>;
}): CatalogExercise {
    return {
        exercise,
        libraryExercise: libraryExercisesBySourceId.get(exercise.id) ?? null
    };
}

export function listCatalogExercisesFactory({
    exerciseRepository
}: {
    exerciseRepository: ExerciseRepository;
}) {
    return async ({ coachId, page, pageSize, search }: ListCatalogExercisesParams) => {
        const nameContains = search.trim() || undefined;
        const catalogExercises = await exerciseRepository.findPage({
            filter: { coachId: null, nameContains, status: ExerciseStatus.Active },
            pagination: getPagePagination({ page, pageSize })
        });
        const result = createPage({ items: catalogExercises, page, pageSize });
        const exercises = result.items;
        const libraryExercises = exercises.length
            ? await exerciseRepository.findAll({
                  filter: {
                      coachId,
                      sourceExerciseIds: exercises.map(exercise => exercise.id)
                  }
              })
            : [];

        const libraryExercisesBySourceId = new Map(
            libraryExercises.map(exercise => [exercise.sourceExerciseId, exercise])
        );

        return {
            exercises: exercises.map(exercise =>
                toCatalogExercise({ exercise, libraryExercisesBySourceId })
            ),
            hasPreviousPage: result.hasPreviousPage,
            hasNextPage: result.hasNextPage
        };
    };
}
