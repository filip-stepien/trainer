import 'server-only';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { listCatalogExercises, listLibraryExercises } from '../../composition';
import type { Exercise } from '../../domain/exercise';
import { ExerciseListStatus, ExerciseListView } from '../lib/routes';
import { type ExerciseListSearchParams, validateExerciseListSearchParams } from '../lib/validation';

export type ExerciseLibraryListItem = Pick<
    Exercise,
    'id' | 'sourceExerciseId' | 'isCustom' | 'name' | 'instructions' | 'videoUrl' | 'status'
>;

export type ExerciseCatalogListItem = Pick<Exercise, 'id' | 'name'> & {
    libraryExercise: Pick<Exercise, 'id' | 'status'> | null;
};

const exercisePageSize = 50;

function toExerciseLibraryListItem(exercise: Exercise): ExerciseLibraryListItem {
    return {
        id: exercise.id,
        sourceExerciseId: exercise.sourceExerciseId,
        isCustom: exercise.isCustom,
        name: exercise.name,
        instructions: exercise.instructions,
        videoUrl: exercise.videoUrl,
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
            exercises: result.exercises.map(({ exercise, libraryExercise }) => ({
                id: exercise.id,
                name: exercise.name,
                libraryExercise: libraryExercise
                    ? { id: libraryExercise.id, status: libraryExercise.status }
                    : null
            })),
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
