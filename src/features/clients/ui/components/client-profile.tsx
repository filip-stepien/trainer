import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared';

import { formatDateForDisplay } from '../lib/date';
import { getClientListPath } from '../lib/routes';
import type { ClientDetails } from '../queries/get-client-details-or-redirect';
import { ClientStatusBadge } from './client-status-badge';

export function ClientProfile({ client }: { client: ClientDetails }) {
    return (
        <div className='flex flex-col gap-6'>
            <div>
                <Button
                    variant='ghost'
                    render={<Link href={getClientListPath()} />}
                    nativeButton={false}
                >
                    <ArrowLeftIcon data-icon='inline-start' />
                    Wszyscy podopieczni
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {client.firstName} {client.lastName}
                    </CardTitle>
                    <CardDescription>Podstawowe informacje o współpracy.</CardDescription>
                </CardHeader>
                <CardContent>
                    <dl className='grid gap-5 sm:grid-cols-2'>
                        <div className='flex flex-col gap-1'>
                            <dt className='text-muted-foreground text-sm'>Status</dt>
                            <dd>
                                <ClientStatusBadge status={client.status} />
                            </dd>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <dt className='text-muted-foreground text-sm'>Początek współpracy</dt>
                            <dd>{formatDateForDisplay({ date: client.startedAt })}</dd>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <dt className='text-muted-foreground text-sm'>E-mail</dt>
                            <dd>
                                <a href={`mailto:${client.email}`} className='hover:underline'>
                                    {client.email}
                                </a>
                            </dd>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <dt className='text-muted-foreground text-sm'>Telefon</dt>
                            <dd>
                                {client.phone ? (
                                    <a href={`tel:${client.phone}`} className='hover:underline'>
                                        {client.phone}
                                    </a>
                                ) : (
                                    <span className='text-muted-foreground'>Nie podano</span>
                                )}
                            </dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>
        </div>
    );
}
