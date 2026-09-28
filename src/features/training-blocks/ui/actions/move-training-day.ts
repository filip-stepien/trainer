'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { moveTrainingDay } from '../../composition';
import { TrainingBlockNotFoundMessages } from '../lib/messages';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import { type MoveTrainingDayFieldErrors, validateMoveTrainingDayForm } from '../lib/validation';

export type MoveTrainingDayActionState = {
    error?: string;
    fieldErrors?: MoveTrainingDayFieldErrors;
};

export async function moveTrainingDayAction(
    formData: FormData
): Promise<MoveTrainingDayActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateMoveTrainingDayForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await moveTrainingDay({ coachId: user.id, ...validation.data });

    if (!result.ok) {
        return { error: TrainingBlockNotFoundMessages.TrainingDay };
    }

    revalidateTrainingBlockNow({ trainingBlockId: validation.data.trainingBlockId });
    return {};
}
