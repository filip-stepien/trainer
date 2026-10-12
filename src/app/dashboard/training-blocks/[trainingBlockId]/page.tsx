import { Suspense } from 'react';

import { getClientFullName, getClientListPath, getClientPath } from '@/features/clients';
import { getClientDetailsOrRedirect } from '@/features/clients/server';
import {
    EditTrainingBlockDialog,
    TrainingBlockEditor,
    TrainingBlockMeta,
    TrainingBlockStatusBadge
} from '@/features/training-blocks';
import {
    getTrainingBlockDetailsOrRedirect,
    getTrainingBlockEditorSelection
} from '@/features/training-blocks/server';
import { PageContainer, PageHeader, PageSkeleton } from '@/shared';

type TrainingBlockPageProps = {
    params: Promise<{ trainingBlockId: string }>;
    searchParams: Promise<{ day?: string | string[]; add?: string | string[] }>;
};

async function TrainingBlockContent({ params, searchParams }: TrainingBlockPageProps) {
    const { trainingBlockId } = await params;
    const selection = getTrainingBlockEditorSelection({ searchParams: await searchParams });
    const trainingBlock = await getTrainingBlockDetailsOrRedirect({ trainingBlockId });
    const client = await getClientDetailsOrRedirect({ clientId: trainingBlock.clientId });

    return (
        <>
            <PageHeader
                breadcrumbs={[
                    { label: 'Podopieczni', href: getClientListPath() },
                    {
                        label: getClientFullName(client),
                        href: getClientPath({ clientId: client.id })
                    },
                    { label: trainingBlock.name }
                ]}
                title={trainingBlock.name}
                badges={<TrainingBlockStatusBadge status={trainingBlock.status} />}
                description={
                    <TrainingBlockMeta
                        startDate={trainingBlock.startDate}
                        durationWeeks={trainingBlock.durationWeeks}
                    />
                }
                actions={<EditTrainingBlockDialog trainingBlock={trainingBlock} />}
            />
            {trainingBlock.description ? (
                <p className='text-muted-foreground max-w-3xl text-sm whitespace-pre-line'>
                    {trainingBlock.description}
                </p>
            ) : null}
            <TrainingBlockEditor
                trainingBlock={trainingBlock}
                initialDayId={selection.trainingDayId}
                initialAddSection={selection.addExerciseSection}
            />
        </>
    );
}

export default function TrainingBlockPage({ params, searchParams }: TrainingBlockPageProps) {
    return (
        <PageContainer>
            <Suspense fallback={<PageSkeleton tiles={4} />}>
                <TrainingBlockContent params={params} searchParams={searchParams} />
            </Suspense>
        </PageContainer>
    );
}
