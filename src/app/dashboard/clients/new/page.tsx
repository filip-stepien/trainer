import { Suspense } from 'react';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';
import { CreateClientForm, getClientListPath } from '@/features/clients';
import { PageContainer, PageHeader, Skeleton, toDateString } from '@/shared';

async function NewClientForm() {
    await getAuthenticatedUserOrRedirect();

    return <CreateClientForm startedAt={toDateString({ date: new Date() })} />;
}

export default function NewClientPage() {
    return (
        <PageContainer>
            <PageHeader
                breadcrumbs={[
                    { label: 'Podopieczni', href: getClientListPath() },
                    { label: 'Nowy podopieczny' }
                ]}
                title='Nowy podopieczny'
                description='Dwa krótkie kroki: dane podopiecznego i kontakt.'
            />
            <Suspense fallback={<Skeleton className='h-96 rounded-xl' />}>
                <NewClientForm />
            </Suspense>
        </PageContainer>
    );
}
