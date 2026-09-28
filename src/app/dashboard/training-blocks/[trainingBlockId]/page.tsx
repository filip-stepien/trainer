import { Suspense } from 'react';

import {
    EditTrainingBlockForm,
    TrainingBlockProfile,
    TrainingDaysEditor
} from '@/features/training-blocks';
import { getTrainingBlockDetailsOrRedirect } from '@/features/training-blocks/server';

import { DashboardPageLoading } from '../../_components/dashboard-page-loading';

type TrainingBlockPageProps = {
    params: Promise<{ trainingBlockId: string }>;
};

export default function TrainingBlockPage({ params }: TrainingBlockPageProps) {
    return (
        <main className='mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6'>
            <Suspense fallback={<DashboardPageLoading />}>
                <TrainingBlockContent params={params} />
            </Suspense>
        </main>
    );
}

async function TrainingBlockContent({ params }: TrainingBlockPageProps) {
    const { trainingBlockId } = await params;
    const trainingBlock = await getTrainingBlockDetailsOrRedirect({ trainingBlockId });

    return (
        <>
            <TrainingBlockProfile trainingBlock={trainingBlock} />
            <EditTrainingBlockForm trainingBlock={trainingBlock} />
            <TrainingDaysEditor trainingBlock={trainingBlock} />
        </>
    );
}
