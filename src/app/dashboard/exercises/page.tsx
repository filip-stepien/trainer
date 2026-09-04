import { Suspense } from 'react';

import { ExerciseList } from '@/features/exercises';
import { getExerciseListOrRedirect } from '@/features/exercises/server';

import { DashboardPageLoading } from '../_components/dashboard-page-loading';

type ExercisesPageProps = {
    searchParams: Promise<{
        page?: string | string[];
        search?: string | string[];
        status?: string | string[];
        view?: string | string[];
    }>;
};

export default function ExercisesPage({ searchParams }: ExercisesPageProps) {
    return (
        <main className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6'>
            <Suspense fallback={<DashboardPageLoading />}>
                <ExerciseListContent searchParams={searchParams} />
            </Suspense>
        </main>
    );
}

async function ExerciseListContent({ searchParams }: ExercisesPageProps) {
    const result = await getExerciseListOrRedirect({ searchParams: await searchParams });

    return <ExerciseList result={result} />;
}
