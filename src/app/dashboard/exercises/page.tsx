import { Suspense } from 'react';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

import { getDashboardPath } from '@/features/auth';
import { ExerciseList, getNewExercisePath } from '@/features/exercises';
import { getExerciseListOrRedirect } from '@/features/exercises/server';
import { Button, PageContainer, PageHeader, TileGridSkeleton } from '@/shared';

type ExercisesPageProps = {
    searchParams: Promise<{
        page?: string | string[];
        search?: string | string[];
        status?: string | string[];
        view?: string | string[];
    }>;
};

async function ExerciseListContent({ searchParams }: ExercisesPageProps) {
    const result = await getExerciseListOrRedirect({ searchParams: await searchParams });

    return <ExerciseList result={result} />;
}

export default function ExercisesPage({ searchParams }: ExercisesPageProps) {
    return (
        <PageContainer>
            <PageHeader
                backHref={getDashboardPath()}
                title='Biblioteka ćwiczeń'
                description='Własne ćwiczenia i gotowe pozycje z katalogu, z których układasz plany.'
                actions={
                    <Button render={<Link href={getNewExercisePath()} />} nativeButton={false}>
                        <PlusIcon data-icon='inline-start' />
                        Dodaj własne
                    </Button>
                }
            />
            <Suspense fallback={<TileGridSkeleton />}>
                <ExerciseListContent searchParams={searchParams} />
            </Suspense>
        </PageContainer>
    );
}
