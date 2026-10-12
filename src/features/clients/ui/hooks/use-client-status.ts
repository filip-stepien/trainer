'use client';

import { useState } from 'react';

import type { ClientStatus } from '../../domain/client';
import { isClientStatus } from '../lib/status';

export function useClientStatus({ initialStatus }: { initialStatus: ClientStatus }) {
    const [status, setStatus] = useState(initialStatus);

    function handleStatusChange(values: unknown[]) {
        const nextStatus = values[0];

        if (isClientStatus(nextStatus)) {
            setStatus(nextStatus);
        }
    }

    return { status, handleStatusChange };
}
