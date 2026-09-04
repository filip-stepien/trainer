import { Suspense } from 'react';

import { EditExerciseForm, ExerciseProfile } from '@/features/exercises';
import { getExerciseDetailsOrRedirect } from '@/features/exercises/server';

import { DashboardPageLoading } from '../../_components/dashboard-page-loading';

type ExercisePageProps = {
    params: Promise<{ exerciseId: string }>;
};

export default function ExercisePage({ params }: ExercisePageProps) {
    return (
        <main className='mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6'>
            <Suspense fallback={<DashboardPageLoading />}>
                <ExerciseDetails params={params} />
            </Suspense>
        </main>
    );
}

async function ExerciseDetails({ params }: ExercisePageProps) {
    const { exerciseId } = await params;
    const exercise = await getExerciseDetailsOrRedirect({ exerciseId });

    return (
        <>
            <ExerciseProfile exercise={exercise} />
            <EditExerciseForm exercise={exercise} />
        </>
    );
}
