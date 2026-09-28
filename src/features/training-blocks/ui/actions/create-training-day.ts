'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { createTrainingDay } from '../../composition';
import { TrainingBlockActionMessages, TrainingBlockNotFoundMessages } from '../lib/messages';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type CreateTrainingDayFieldErrors,
    validateCreateTrainingDayForm
} from '../lib/validation';

export type CreateTrainingDayActionState = {
    error?: string;
    success?: string;
    fieldErrors?: CreateTrainingDayFieldErrors;
};

export async function createTrainingDayAction(
    formData: FormData
): Promise<CreateTrainingDayActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateCreateTrainingDayForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { trainingBlockId, ...data } = validation.data;
    const result = await createTrainingDay({ coachId: user.id, trainingBlockId, data });

    if (!result.ok) {
        return { error: TrainingBlockNotFoundMessages.Draft };
    }

    revalidateTrainingBlockNow({ trainingBlockId });
    return { success: TrainingBlockActionMessages.TrainingDayAdded };
}
