'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { updateTrainingDayExercise } from '../../composition';
import { TrainingBlockActionMessages, TrainingBlockNotFoundMessages } from '../lib/messages';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type UpdateTrainingDayExerciseFieldErrors,
    validateUpdateTrainingDayExerciseForm
} from '../lib/validation';

export type UpdateTrainingDayExerciseActionState = {
    error?: string;
    success?: string;
    fieldErrors?: UpdateTrainingDayExerciseFieldErrors;
};

export async function updateTrainingDayExerciseAction(
    formData: FormData
): Promise<UpdateTrainingDayExerciseActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateUpdateTrainingDayExerciseForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { trainingBlockId, trainingDayId, trainingDayExerciseId, ...data } = validation.data;
    const result = await updateTrainingDayExercise({
        coachId: user.id,
        trainingBlockId,
        trainingDayId,
        trainingDayExerciseId,
        data
    });

    if (!result.ok) {
        return { error: TrainingBlockNotFoundMessages.TrainingDayExercise };
    }

    revalidateTrainingBlockNow({ trainingBlockId });
    return { success: TrainingBlockActionMessages.TrainingDayExerciseSaved };
}
