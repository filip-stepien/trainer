import { Suspense } from 'react';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

import { getDashboardPath } from '@/features/auth';
import { ClientList, getNewClientPath } from '@/features/clients';
import { getClientListOrRedirect } from '@/features/clients/server';
import { Button, PageContainer, PageHeader, TileGridSkeleton } from '@/shared';

async function ClientListContent() {
    const clients = await getClientListOrRedirect();

    return <ClientList clients={clients} />;
}

export default function ClientsPage() {
    return (
        <PageContainer>
            <PageHeader
                backHref={getDashboardPath()}
                title='Podopieczni'
                description='Osoby, z którymi współpracujesz, i ich plany treningowe.'
                actions={
                    <Button render={<Link href={getNewClientPath()} />} nativeButton={false}>
                        <PlusIcon data-icon='inline-start' />
                        Dodaj podopiecznego
                    </Button>
                }
            />
            <Suspense fallback={<TileGridSkeleton />}>
                <ClientListContent />
            </Suspense>
        </PageContainer>
    );
}
