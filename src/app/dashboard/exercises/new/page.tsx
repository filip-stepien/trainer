import { Suspense } from 'react';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';
import { CreateExerciseForm } from '@/features/exercises';

import { DashboardPageLoading } from '../../_components/dashboard-page-loading';

export default function NewExercisePage() {
    return (
        <main className='mx-auto w-full max-w-2xl px-4 py-8 sm:px-6'>
            <Suspense fallback={<DashboardPageLoading />}>
                <NewExerciseForm />
            </Suspense>
        </main>
    );
}

async function NewExerciseForm() {
    await getAuthenticatedUserOrRedirect();

    return <CreateExerciseForm />;
}
