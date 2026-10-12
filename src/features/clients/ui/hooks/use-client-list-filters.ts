'use client';

import { useState } from 'react';

import type { Client } from '../../domain/client';
import {
    ClientStatusFilter,
    clientStatusFilterOptions,
    filterClients,
    isClientStatusFilter
} from '../lib/filtering';

export function useClientListFilters<
    Item extends Pick<Client, 'firstName' | 'lastName' | 'email' | 'phone' | 'status'>
>({ clients }: { clients: Item[] }) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<ClientStatusFilter>(ClientStatusFilter.All);

    function handleStatusChange(values: unknown[]) {
        const nextStatus = values[0];

        if (isClientStatusFilter(nextStatus)) {
            setStatus(nextStatus);
        }
    }

    function resetFilters() {
        setSearch('');
        setStatus(ClientStatusFilter.All);
    }

    return {
        search,
        status,
        statusOptions: clientStatusFilterOptions,
        visibleClients: filterClients({ clients, search, status }),
        setSearch,
        handleStatusChange,
        resetFilters
    };
}
