import { ExerciseStatus } from '../../domain/exercise';

const exerciseListPath = '/dashboard/exercises';

export const ExerciseListStatus = {
    ...ExerciseStatus,
    All: 'all'
} as const;

export type ExerciseListStatus = (typeof ExerciseListStatus)[keyof typeof ExerciseListStatus];

export const ExerciseListView = {
    Library: 'library',
    Catalog: 'catalog'
} as const;

export type ExerciseListView = (typeof ExerciseListView)[keyof typeof ExerciseListView];

export function getExerciseListPath() {
    return exerciseListPath;
}

export function getExerciseListHref({
    page,
    search,
    status,
    view
}: {
    page: number;
    search: string;
    status: ExerciseListStatus;
    view: ExerciseListView;
}) {
    const params = new URLSearchParams();

    if (view !== ExerciseListView.Library) {
        params.set('view', view);
    }

    if (search) {
        params.set('search', search);
    }

    if (view === ExerciseListView.Library && status !== ExerciseListStatus.Active) {
        params.set('status', status);
    }

    if (page > 1) {
        params.set('page', page.toString());
    }

    const query = params.toString();
    return query ? `${exerciseListPath}?${query}` : exerciseListPath;
}

export function getNewExercisePath() {
    return `${exerciseListPath}/new`;
}

export function getExercisePath({ exerciseId }: { exerciseId: string }) {
    return `${exerciseListPath}/${exerciseId}`;
}
