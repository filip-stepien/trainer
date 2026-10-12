import { Suspense } from 'react';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';
import { CreateExerciseForm, getExerciseListPath } from '@/features/exercises';
import { PageContainer, PageHeader, Skeleton } from '@/shared';

async function NewExerciseForm() {
    await getAuthenticatedUserOrRedirect();

    return <CreateExerciseForm />;
}

export default function NewExercisePage() {
    return (
        <PageContainer>
            <PageHeader
                breadcrumbs={[
                    { label: 'Biblioteka ćwiczeń', href: getExerciseListPath() },
                    { label: 'Nowe ćwiczenie' }
                ]}
                title='Nowe ćwiczenie'
                description='Definicja, którą wykorzystasz później w wielu planach treningowych.'
            />
            <Suspense fallback={<Skeleton className='h-96 rounded-xl' />}>
                <NewExerciseForm />
            </Suspense>
        </PageContainer>
    );
}
