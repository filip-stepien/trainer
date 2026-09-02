import { Suspense } from 'react';

import { ClientProfile, EditClientForm } from '@/features/clients';
import { getClientDetailsOrRedirect } from '@/features/clients/server';

import { DashboardPageLoading } from '../../_components/dashboard-page-loading';

type ClientPageProps = {
    params: Promise<{ clientId: string }>;
};

export default function ClientPage({ params }: ClientPageProps) {
    return (
        <main className='mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6'>
            <Suspense fallback={<DashboardPageLoading />}>
                <ClientDetails params={params} />
            </Suspense>
        </main>
    );
}

async function ClientDetails({ params }: ClientPageProps) {
    const { clientId } = await params;
    const client = await getClientDetailsOrRedirect({ clientId });

    return (
        <>
            <ClientProfile client={client} />
            <EditClientForm client={client} />
        </>
    );
}
