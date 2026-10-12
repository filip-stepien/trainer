import { normalizeSearchText } from '@/shared';

import { type Client, ClientStatus, getClientFullName } from '../../domain/client';
import { clientStatusOptions } from './status';

export const ClientStatusFilter = {
    All: 'all',
    ...ClientStatus
} as const;

export type ClientStatusFilter = (typeof ClientStatusFilter)[keyof typeof ClientStatusFilter];

export const clientStatusFilterOptions: { value: ClientStatusFilter; label: string }[] = [
    { value: ClientStatusFilter.All, label: 'Wszyscy' },
    ...clientStatusOptions
];

type FilterableClient = Pick<Client, 'firstName' | 'lastName' | 'email' | 'phone' | 'status'>;

export function isClientStatusFilter(value: unknown): value is ClientStatusFilter {
    return clientStatusFilterOptions.some(option => option.value === value);
}

function getClientSearchText(client: FilterableClient) {
    return normalizeSearchText(
        `${getClientFullName(client)} ${client.email} ${client.phone ?? ''}`
    );
}

export function filterClients<Item extends FilterableClient>({
    clients,
    search,
    status
}: {
    clients: Item[];
    search: string;
    status: ClientStatusFilter;
}) {
    const query = normalizeSearchText(search);

    return clients.filter(
        client =>
            (status === ClientStatusFilter.All || client.status === status) &&
            getClientSearchText(client).includes(query)
    );
}
