import { getClientTrainingPath } from '@/features/clients';

const trainingBlockListPath = '/dashboard/training-blocks';

export function getNewTrainingBlockPath({ clientId }: { clientId: string }) {
    return `${getClientTrainingPath({ clientId })}/new`;
}

export function getTrainingBlockPath({ trainingBlockId }: { trainingBlockId: string }) {
    return `${trainingBlockListPath}/${trainingBlockId}`;
}
