import { Suspense } from 'react';

import {
    EditExerciseDialog,
    ExerciseBadges,
    ExerciseOverview,
    ExerciseStatusForm,
    getExerciseListPath
} from '@/features/exercises';
import { getExerciseDetailsOrRedirect } from '@/features/exercises/server';
import { PageContainer, PageHeader, PageSkeleton } from '@/shared';

type ExercisePageProps = {
    params: Promise<{ exerciseId: string }>;
};

async function ExerciseDetailsContent({ params }: ExercisePageProps) {
    const { exerciseId } = await params;
    const exercise = await getExerciseDetailsOrRedirect({ exerciseId });

    return (
        <>
            <PageHeader
                breadcrumbs={[
                    { label: 'Biblioteka ćwiczeń', href: getExerciseListPath() },
                    { label: exercise.name }
                ]}
                title={exercise.name}
                badges={<ExerciseBadges isCustom={exercise.isCustom} status={exercise.status} />}
                description={
                    exercise.isCustom
                        ? 'Własna definicja ćwiczenia.'
                        : 'Edytowalna kopia ćwiczenia dodanego z katalogu.'
                }
                actions={
                    <>
                        <ExerciseStatusForm exerciseId={exercise.id} status={exercise.status} />
                        <EditExerciseDialog exercise={exercise} />
                    </>
                }
            />
            <ExerciseOverview exercise={exercise} />
        </>
    );
}

export default function ExercisePage({ params }: ExercisePageProps) {
    return (
        <PageContainer>
            <Suspense fallback={<PageSkeleton tiles={2} />}>
                <ExerciseDetailsContent params={params} />
            </Suspense>
        </PageContainer>
    );
}
