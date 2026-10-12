import 'server-only';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { listClients } from '../../composition';
import type { Client } from '../../domain/client';

export type ClientListItem = Pick<
    Client,
    'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'status' | 'startedAt' | 'endsAt'
>;

function toClientListItem(client: Client): ClientListItem {
    return {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        status: client.status,
        startedAt: client.startedAt,
        endsAt: client.endsAt
    };
}

export async function getClientListOrRedirect() {
    const user = await getAuthenticatedUserOrRedirect();
    const clients = await listClients({ coachId: user.id });
    return clients.map(toClientListItem);
}
