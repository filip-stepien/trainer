import 'server-only';

import { redirect } from 'next/navigation';

import { getClientListPath, getClientTrainingPath } from '@/features/clients';

import { getTrainingBlockPath } from './routes';

export function redirectToClientList(): never {
    redirect(getClientListPath());
}

export function redirectToClientTraining({ clientId }: { clientId: string }): never {
    redirect(getClientTrainingPath({ clientId }));
}

export function redirectToTrainingBlock({ trainingBlockId }: { trainingBlockId: string }): never {
    redirect(getTrainingBlockPath({ trainingBlockId }));
}
