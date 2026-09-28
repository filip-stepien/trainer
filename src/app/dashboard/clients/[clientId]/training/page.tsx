import { Suspense } from 'react';

import { getClientDetailsOrRedirect } from '@/features/clients/server';
import { TrainingBlockList } from '@/features/training-blocks';
import { getTrainingBlockListOrRedirect } from '@/features/training-blocks/server';

import { DashboardPageLoading } from '../../../_components/dashboard-page-loading';

type ClientTrainingPageProps = {
    params: Promise<{ clientId: string }>;
};

export default function ClientTrainingPage({ params }: ClientTrainingPageProps) {
    return (
        <main className='mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6'>
            <Suspense fallback={<DashboardPageLoading />}>
                <ClientTrainingContent params={params} />
            </Suspense>
        </main>
    );
}

async function ClientTrainingContent({ params }: ClientTrainingPageProps) {
    const { clientId } = await params;
    const [client, trainingBlocks] = await Promise.all([
        getClientDetailsOrRedirect({ clientId }),
        getTrainingBlockListOrRedirect({ clientId })
    ]);

    return (
        <TrainingBlockList
            clientId={client.id}
            clientName={`${client.firstName} ${client.lastName}`}
            trainingBlocks={trainingBlocks}
        />
    );
}
