import { Suspense } from 'react';

import { ClientList } from '@/features/clients';
import { getClientListOrRedirect } from '@/features/clients/server';

import { DashboardPageLoading } from '../_components/dashboard-page-loading';

export default function ClientsPage() {
    return (
        <main className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6'>
            <Suspense fallback={<DashboardPageLoading />}>
                <ClientListContent />
            </Suspense>
        </main>
    );
}

async function ClientListContent() {
    const clients = await getClientListOrRedirect();

    return <ClientList clients={clients} />;
}
