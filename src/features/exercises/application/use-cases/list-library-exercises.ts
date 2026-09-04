import { createPage, getPagePagination } from '@/shared';

import type { ExerciseStatus } from '../../domain/exercise';
import type { ExerciseRepository } from '../ports/exercise-repository';

export type ListLibraryExercisesParams = {
    coachId: string;
    page: number;
    pageSize: number;
    search: string;
    status: ExerciseStatus | null;
};

export function listLibraryExercisesFactory({
    exerciseRepository
}: {
    exerciseRepository: ExerciseRepository;
}) {
    return async ({ coachId, page, pageSize, search, status }: ListLibraryExercisesParams) => {
        const nameContains = search.trim() || undefined;
        const exercises = await exerciseRepository.findPage({
            filter: {
                coachId,
                nameContains,
                status: status ?? undefined
            },
            pagination: getPagePagination({ page, pageSize })
        });
        const result = createPage({ items: exercises, page, pageSize });

        return {
            exercises: result.items,
            hasPreviousPage: result.hasPreviousPage,
            hasNextPage: result.hasNextPage
        };
    };
}
