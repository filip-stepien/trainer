import { Suspense } from 'react';

import { getClientDetailsOrRedirect } from '@/features/clients/server';
import { CreateTrainingBlockForm } from '@/features/training-blocks';
import { toDateString } from '@/shared';

import { DashboardPageLoading } from '../../../../_components/dashboard-page-loading';

type NewTrainingBlockPageProps = {
    params: Promise<{ clientId: string }>;
};

export default function NewTrainingBlockPage({ params }: NewTrainingBlockPageProps) {
    return (
        <main className='mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6'>
            <Suspense fallback={<DashboardPageLoading />}>
                <NewTrainingBlockContent params={params} />
            </Suspense>
        </main>
    );
}

async function NewTrainingBlockContent({ params }: NewTrainingBlockPageProps) {
    const { clientId } = await params;
    const client = await getClientDetailsOrRedirect({ clientId });

    return (
        <CreateTrainingBlockForm
            clientId={client.id}
            clientName={`${client.firstName} ${client.lastName}`}
            startDate={toDateString({ date: new Date() })}
        />
    );
}
