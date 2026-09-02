import 'server-only';

import { redirect } from 'next/navigation';

import { getClientListPath, getClientPath } from './routes';

export function redirectToClientList(): never {
    redirect(getClientListPath());
}

export function redirectToClient({ clientId }: { clientId: string }): never {
    redirect(getClientPath({ clientId }));
}
