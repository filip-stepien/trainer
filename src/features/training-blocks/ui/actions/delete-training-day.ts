'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { deleteTrainingDay } from '../../composition';
import { TrainingBlockNotFoundMessages } from '../lib/messages';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type DeleteTrainingDayFieldErrors,
    validateDeleteTrainingDayForm
} from '../lib/validation';

export type DeleteTrainingDayActionState = {
    error?: string;
    fieldErrors?: DeleteTrainingDayFieldErrors;
};

export async function deleteTrainingDayAction(
    formData: FormData
): Promise<DeleteTrainingDayActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateDeleteTrainingDayForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await deleteTrainingDay({ coachId: user.id, ...validation.data });

    if (!result.ok) {
        return { error: TrainingBlockNotFoundMessages.TrainingDay };
    }

    revalidateTrainingBlockNow({ trainingBlockId: validation.data.trainingBlockId });
    return {};
}
