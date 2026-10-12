import 'server-only';

import { getClientPath } from '@/features/clients';
import { revalidateNow } from '@/shared/server';

import { getTrainingBlockPath } from './routes';

export function revalidateClientNow({ clientId }: { clientId: string }) {
    revalidateNow({ path: getClientPath({ clientId }) });
}

export function revalidateTrainingBlockNow({ trainingBlockId }: { trainingBlockId: string }) {
    revalidateNow({ path: getTrainingBlockPath({ trainingBlockId }) });
}
