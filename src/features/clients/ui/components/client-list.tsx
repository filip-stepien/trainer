'use client';

import Link from 'next/link';
import { CalendarIcon, MailIcon, PhoneIcon, PlusIcon, SearchXIcon, UsersIcon } from 'lucide-react';

import {
    Button,
    CardContent,
    CardHeader,
    CardTitle,
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    SearchField,
    Tile,
    TileGrid,
    TileLink,
    ToggleGroup,
    ToggleGroupItem,
    formatDateForDisplay
} from '@/shared';

import { getClientFullName } from '../../domain/client';
import { useClientListFilters } from '../hooks/use-client-list-filters';
import { getClientPath, getNewClientPath } from '../lib/routes';
import type { ClientListItem } from '../queries/get-client-list-or-redirect';
import { ClientAvatar } from './client-avatar';
import { ClientStatusBadge } from './client-status-badge';

function ClientTile({ client }: { client: ClientListItem }) {
    return (
        <Tile interactive className='pt-0'>
            <CardHeader className='bg-muted/50 flex items-center gap-3 border-b pt-4'>
                <ClientAvatar
                    firstName={client.firstName}
                    lastName={client.lastName}
                    onMutedBackground
                />
                <CardTitle className='truncate'>
                    <TileLink href={getClientPath({ clientId: client.id })}>
                        {getClientFullName(client)}
                    </TileLink>
                </CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground flex flex-col gap-2 text-sm'>
                <span className='flex min-w-0 items-center gap-2'>
                    <MailIcon className='size-4 shrink-0' />
                    <span className='truncate'>{client.email}</span>
                </span>
                <span className='flex items-center gap-2'>
                    <PhoneIcon className='size-4 shrink-0' />
                    {client.phone ?? 'Brak telefonu'}
                </span>
                <span className='flex flex-wrap items-center justify-between gap-2'>
                    <span className='flex items-center gap-2'>
                        <CalendarIcon className='size-4 shrink-0' />
                        Współpraca od {formatDateForDisplay({ date: client.startedAt })}
                        {client.endsAt
                            ? ` do ${formatDateForDisplay({ date: client.endsAt })}`
                            : null}
                    </span>
                    <ClientStatusBadge status={client.status} />
                </span>
            </CardContent>
        </Tile>
    );
}

function ClientListEmpty() {
    return (
        <Empty className='border'>
            <EmptyHeader>
                <EmptyMedia variant='icon'>
                    <UsersIcon />
                </EmptyMedia>
                <EmptyTitle>Nie masz jeszcze podopiecznych</EmptyTitle>
                <EmptyDescription>
                    Dodaj pierwszą osobę, aby rozpocząć prowadzenie współpracy.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button render={<Link href={getNewClientPath()} />} nativeButton={false}>
                    <PlusIcon data-icon='inline-start' />
                    Dodaj podopiecznego
                </Button>
            </EmptyContent>
        </Empty>
    );
}

function ClientListNoResults({ onReset }: { onReset: () => void }) {
    return (
        <Empty className='border'>
            <EmptyHeader>
                <EmptyMedia variant='icon'>
                    <SearchXIcon />
                </EmptyMedia>
                <EmptyTitle>Brak pasujących podopiecznych</EmptyTitle>
                <EmptyDescription>Zmień wyszukiwaną frazę albo filtr statusu.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button variant='outline' onClick={onReset}>
                    Wyczyść filtry
                </Button>
            </EmptyContent>
        </Empty>
    );
}

export function ClientList({ clients }: { clients: ClientListItem[] }) {
    const {
        search,
        status,
        statusOptions,
        visibleClients,
        setSearch,
        handleStatusChange,
        resetFilters
    } = useClientListFilters({ clients });

    if (!clients.length) {
        return <ClientListEmpty />;
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                <SearchField
                    className='md:max-w-sm md:flex-1'
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder='Szukaj po imieniu, nazwisku lub e-mailu'
                    aria-label='Szukaj podopiecznych'
                />
                <ToggleGroup
                    value={[status]}
                    onValueChange={handleStatusChange}
                    variant='outline'
                    size='sm'
                    spacing={0}
                    aria-label='Filtruj po statusie współpracy'
                >
                    {statusOptions.map(option => (
                        <ToggleGroupItem key={option.value} value={option.value}>
                            {option.label}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>
            {visibleClients.length ? (
                <TileGrid>
                    {visibleClients.map(client => (
                        <ClientTile key={client.id} client={client} />
                    ))}
                </TileGrid>
            ) : (
                <ClientListNoResults onReset={resetFilters} />
            )}
        </div>
    );
}
