import { Suspense } from 'react';

import {
    ClientAvatar,
    ClientOverview,
    EditClientDialog,
    getClientFullName,
    getClientListPath
} from '@/features/clients';
import { getClientDetailsOrRedirect } from '@/features/clients/server';
import { TrainingBlockList } from '@/features/training-blocks';
import { getTrainingBlockListOrRedirect } from '@/features/training-blocks/server';
import { PageContainer, PageHeader, PageSkeleton, toDateString } from '@/shared';

type ClientPageProps = {
    params: Promise<{ clientId: string }>;
};

async function ClientDetailsContent({ params }: ClientPageProps) {
    const { clientId } = await params;
    const [client, trainingBlocks] = await Promise.all([
        getClientDetailsOrRedirect({ clientId }),
        getTrainingBlockListOrRedirect({ clientId })
    ]);
    const name = getClientFullName(client);

    return (
        <>
            <PageHeader
                breadcrumbs={[{ label: 'Podopieczni', href: getClientListPath() }, { label: name }]}
                leading={
                    <ClientAvatar
                        firstName={client.firstName}
                        lastName={client.lastName}
                        size='lg'
                    />
                }
                title={name}
                actions={<EditClientDialog client={client} />}
            />
            <ClientOverview client={client} />
            <TrainingBlockList
                clientId={client.id}
                startDate={toDateString({ date: new Date() })}
                trainingBlocks={trainingBlocks}
            />
        </>
    );
}

export default function ClientPage({ params }: ClientPageProps) {
    return (
        <PageContainer>
            <Suspense fallback={<PageSkeleton tiles={4} />}>
                <ClientDetailsContent params={params} />
            </Suspense>
        </PageContainer>
    );
}
