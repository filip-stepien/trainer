import 'server-only';

import { redirect } from 'next/navigation';

import { getClientListPath, getClientPath } from '@/features/clients';

import { getTrainingBlockPath } from './routes';

export function redirectToClientList(): never {
    redirect(getClientListPath());
}

export function redirectToClient({ clientId }: { clientId: string }): never {
    redirect(getClientPath({ clientId }));
}

export function redirectToTrainingBlock({ trainingBlockId }: { trainingBlockId: string }): never {
    redirect(getTrainingBlockPath({ trainingBlockId }));
}
