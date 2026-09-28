'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { updateTrainingDay } from '../../composition';
import { TrainingBlockActionMessages, TrainingBlockNotFoundMessages } from '../lib/messages';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type UpdateTrainingDayFieldErrors,
    validateUpdateTrainingDayForm
} from '../lib/validation';

export type UpdateTrainingDayActionState = {
    error?: string;
    success?: string;
    fieldErrors?: UpdateTrainingDayFieldErrors;
};

export async function updateTrainingDayAction(
    formData: FormData
): Promise<UpdateTrainingDayActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateUpdateTrainingDayForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { trainingBlockId, trainingDayId, ...data } = validation.data;
    const result = await updateTrainingDay({
        coachId: user.id,
        trainingBlockId,
        trainingDayId,
        data
    });

    if (!result.ok) {
        return { error: TrainingBlockNotFoundMessages.TrainingDay };
    }

    revalidateTrainingBlockNow({ trainingBlockId });
    return { success: TrainingBlockActionMessages.TrainingDaySaved };
}
