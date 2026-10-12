'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { setTrainingDayExerciseLink } from '../../composition';
import { TrainingBlockNotFoundMessages } from '../lib/messages';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type SetTrainingDayExerciseLinkFieldErrors,
    validateSetTrainingDayExerciseLinkForm
} from '../lib/validation';

export type SetTrainingDayExerciseLinkActionState = {
    error?: string;
    fieldErrors?: SetTrainingDayExerciseLinkFieldErrors;
};

export async function setTrainingDayExerciseLinkAction(
    formData: FormData
): Promise<SetTrainingDayExerciseLinkActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateSetTrainingDayExerciseLinkForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await setTrainingDayExerciseLink({ coachId: user.id, ...validation.data });

    if (!result.ok) {
        return { error: TrainingBlockNotFoundMessages.TrainingDayExercise };
    }

    revalidateTrainingBlockNow({ trainingBlockId: validation.data.trainingBlockId });
    return {};
}
