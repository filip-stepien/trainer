import 'server-only';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import type { CatalogExercise } from '../../application/use-cases/list-catalog-exercises';
import { listCatalogExercises, listLibraryExercises } from '../../composition';
import { type Exercise, isExerciseArchived } from '../../domain/exercise';
import { ExerciseListStatus, ExerciseListView } from '../lib/routes';
import { type ExerciseListSearchParams, validateExerciseListSearchParams } from '../lib/validation';

const exercisePageSize = 50;

export type ExerciseLibraryListItem = Pick<
    Exercise,
    'id' | 'sourceExerciseId' | 'isCustom' | 'name' | 'instructions' | 'status'
>;

export type ExerciseCatalogListItem = Pick<Exercise, 'id' | 'name'> & {
    activeLibraryExerciseId: string | null;
};

function toExerciseCatalogListItem({
    exercise,
    libraryExercise
}: CatalogExercise): ExerciseCatalogListItem {
    return {
        id: exercise.id,
        name: exercise.name,
        activeLibraryExerciseId:
            libraryExercise && !isExerciseArchived(libraryExercise) ? libraryExercise.id : null
    };
}

function toExerciseLibraryListItem(exercise: Exercise): ExerciseLibraryListItem {
    return {
        id: exercise.id,
        sourceExerciseId: exercise.sourceExerciseId,
        isCustom: exercise.isCustom,
        name: exercise.name,
        instructions: exercise.instructions,
        status: exercise.status
    };
}

export async function getExerciseListOrRedirect({
    searchParams
}: {
    searchParams: ExerciseListSearchParams;
}) {
    const user = await getAuthenticatedUserOrRedirect();
    const filters = validateExerciseListSearchParams(searchParams);

    if (filters.view === ExerciseListView.Catalog) {
        const result = await listCatalogExercises({
            coachId: user.id,
            page: filters.page,
            pageSize: exercisePageSize,
            search: filters.search
        });

        return {
            view: ExerciseListView.Catalog,
            exercises: result.exercises.map(toExerciseCatalogListItem),
            filters,
            pagination: {
                page: filters.page,
                hasPreviousPage: result.hasPreviousPage,
                hasNextPage: result.hasNextPage
            }
        } as const;
    }

    const result = await listLibraryExercises({
        coachId: user.id,
        page: filters.page,
        pageSize: exercisePageSize,
        search: filters.search,
        status: filters.status === ExerciseListStatus.All ? null : filters.status
    });

    return {
        view: ExerciseListView.Library,
        exercises: result.exercises.map(toExerciseLibraryListItem),
        filters,
        pagination: {
            page: filters.page,
            hasPreviousPage: result.hasPreviousPage,
            hasNextPage: result.hasNextPage
        }
    } as const;
}

export type ExerciseListResult = Awaited<ReturnType<typeof getExerciseListOrRedirect>>;
