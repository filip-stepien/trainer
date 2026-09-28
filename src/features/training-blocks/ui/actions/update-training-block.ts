'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { updateTrainingBlock } from '../../composition';
import { TrainingBlockActionMessages, TrainingBlockNotFoundMessages } from '../lib/messages';
import { revalidateClientTrainingNow, revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type UpdateTrainingBlockFieldErrors,
    validateUpdateTrainingBlockForm
} from '../lib/validation';

export type UpdateTrainingBlockActionState = {
    error?: string;
    success?: string;
    fieldErrors?: UpdateTrainingBlockFieldErrors;
};

export async function updateTrainingBlockAction(
    formData: FormData
): Promise<UpdateTrainingBlockActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateUpdateTrainingBlockForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { trainingBlockId, ...data } = validation.data;
    const result = await updateTrainingBlock({ coachId: user.id, trainingBlockId, data });

    if (!result.ok) {
        return { error: TrainingBlockNotFoundMessages.Draft };
    }

    revalidateClientTrainingNow({ clientId: result.value.clientId });
    revalidateTrainingBlockNow({ trainingBlockId });
    return { success: TrainingBlockActionMessages.TrainingBlockSaved };
}
