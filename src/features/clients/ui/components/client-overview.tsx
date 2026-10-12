import { CalendarIcon, HandshakeIcon, MailIcon, PhoneIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, TileGrid, formatDateForDisplay } from '@/shared';

import type { ClientDetails } from '../queries/get-client-details-or-redirect';
import { ClientStatusBadge } from './client-status-badge';

function ContactTile({ client }: { client: ClientDetails }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <MailIcon className='size-4' />
                    Kontakt
                </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-3 text-sm'>
                <a
                    href={`mailto:${client.email}`}
                    className='flex items-center gap-2 break-all hover:underline'
                >
                    <MailIcon className='text-muted-foreground size-4 shrink-0' />
                    {client.email}
                </a>
                {client.phone ? (
                    <a
                        href={`tel:${client.phone}`}
                        className='flex items-center gap-2 hover:underline'
                    >
                        <PhoneIcon className='text-muted-foreground size-4 shrink-0' />
                        {client.phone}
                    </a>
                ) : (
                    <span className='text-muted-foreground flex items-center gap-2'>
                        <PhoneIcon className='size-4 shrink-0' />
                        Nie podano telefonu
                    </span>
                )}
            </CardContent>
        </Card>
    );
}

function CollaborationTile({ client }: { client: ClientDetails }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <HandshakeIcon className='size-4' />
                    Współpraca
                </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-3 text-sm'>
                <span className='flex items-center gap-2'>
                    <span className='text-muted-foreground'>Status:</span>
                    <ClientStatusBadge status={client.status} />
                </span>
                <span className='flex items-center gap-2'>
                    <CalendarIcon className='text-muted-foreground size-4 shrink-0' />
                    Od {formatDateForDisplay({ date: client.startedAt })}
                </span>
            </CardContent>
        </Card>
    );
}

export function ClientOverview({ client }: { client: ClientDetails }) {
    return (
        <TileGrid columns={2}>
            <ContactTile client={client} />
            <CollaborationTile client={client} />
        </TileGrid>
    );
}
