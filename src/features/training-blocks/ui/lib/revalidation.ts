import 'server-only';

import { getClientTrainingPath } from '@/features/clients';
import { revalidateNow } from '@/shared/server';

import { getTrainingBlockPath } from './routes';

export function revalidateClientTrainingNow({ clientId }: { clientId: string }) {
    revalidateNow({ path: getClientTrainingPath({ clientId }) });
}

export function revalidateTrainingBlockNow({ trainingBlockId }: { trainingBlockId: string }) {
    revalidateNow({ path: getTrainingBlockPath({ trainingBlockId }) });
}
