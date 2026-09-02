import 'server-only';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { getClient } from '../../composition';
import type { Client } from '../../domain/client';
import { redirectToClientList } from '../lib/navigation';
import { validateClientId } from '../lib/validation';

export type ClientDetails = Pick<
    Client,
    'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'status' | 'startedAt'
>;

function toClientDetails(client: Client): ClientDetails {
    return {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        status: client.status,
        startedAt: client.startedAt
    };
}

export async function getClientDetailsOrRedirect({ clientId }: { clientId: string }) {
    const user = await getAuthenticatedUserOrRedirect();
    const validation = validateClientId({ clientId });

    if (!validation.ok) {
        redirectToClientList();
    }

    const result = await getClient({ coachId: user.id, clientId: validation.data });

    if (!result.ok) {
        redirectToClientList();
    }

    return toClientDetails(result.value);
}
