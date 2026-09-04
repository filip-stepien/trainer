import { createPage, getPagePagination } from '@/shared';

import { ExerciseStatus } from '../../domain/exercise';
import type { ExerciseRepository } from '../ports/exercise-repository';

export type ListCatalogExercisesParams = {
    coachId: string;
    page: number;
    pageSize: number;
    search: string;
};

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

        const libraryExerciseBySourceId = new Map(
            libraryExercises.map(exercise => [exercise.sourceExerciseId, exercise])
        );

        return {
            exercises: exercises.map(exercise => ({
                exercise,
                libraryExercise: libraryExerciseBySourceId.get(exercise.id) ?? null
            })),
            hasPreviousPage: result.hasPreviousPage,
            hasNextPage: result.hasNextPage
        };
    };
}
