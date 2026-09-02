'use client';

import { useState } from 'react';

import { ClientStatus, type ClientStatus as ClientStatusValue } from '../../domain/client';

export function useClientStatus({ initialStatus }: { initialStatus: ClientStatusValue }) {
    const [status, setStatus] = useState(initialStatus);

    function handleStatusChange(values: unknown[]) {
        const nextStatus = values[0];

        if (Object.values(ClientStatus).includes(nextStatus as ClientStatusValue)) {
            setStatus(nextStatus as ClientStatusValue);
        }
    }

    return { status, handleStatusChange };
}
