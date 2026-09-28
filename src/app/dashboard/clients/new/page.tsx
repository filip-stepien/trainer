import { Suspense } from 'react';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';
import { CreateClientForm } from '@/features/clients';
import { toDateString } from '@/shared';

import { DashboardPageLoading } from '../../_components/dashboard-page-loading';

export default function NewClientPage() {
    return (
        <main className='mx-auto w-full max-w-2xl px-4 py-8 sm:px-6'>
            <Suspense fallback={<DashboardPageLoading />}>
                <NewClientForm />
            </Suspense>
        </main>
    );
}

async function NewClientForm() {
    await getAuthenticatedUserOrRedirect();

    const startedAt = toDateString({ date: new Date() });

    return <CreateClientForm startedAt={startedAt} />;
}
