import 'server-only';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';
import { toDateString } from '@/shared';

import { listTrainingBlocks } from '../../composition';
import type { TrainingBlock, TrainingBlockStatus } from '../../domain/training-block';
import { redirectToClientList } from '../lib/navigation';
import { validateClientId } from '../lib/validation';

export type TrainingBlockListItem = {
    id: string;
    status: TrainingBlockStatus;
    name: string;
    description: string | null;
    durationWeeks: number | null;
    startDate: string;
    createdAt: string;
    hasDraft: boolean;
};

function toTrainingBlockListItem(trainingBlock: TrainingBlock): TrainingBlockListItem {
    return {
        id: trainingBlock.id,
        status: trainingBlock.status,
        name: trainingBlock.draftVersion?.name ?? 'Plan treningowy',
        description: trainingBlock.draftVersion?.description ?? null,
        durationWeeks: trainingBlock.draftVersion?.durationWeeks ?? null,
        startDate: trainingBlock.startDate,
        createdAt: toDateString({ date: new Date(trainingBlock.createdAt) }),
        hasDraft: Boolean(trainingBlock.draftVersion)
    };
}

export async function getTrainingBlockListOrRedirect({ clientId }: { clientId: string }) {
    const user = await getAuthenticatedUserOrRedirect();
    const validation = validateClientId({ clientId });

    if (!validation.ok) {
        redirectToClientList();
    }

    const trainingBlocks = await listTrainingBlocks({
        coachId: user.id,
        clientId: validation.data
    });

    return trainingBlocks.map(toTrainingBlockListItem);
}
