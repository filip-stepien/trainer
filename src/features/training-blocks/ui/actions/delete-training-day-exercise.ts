'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { deleteTrainingDayExercise } from '../../composition';
import { TrainingBlockNotFoundMessages } from '../lib/messages';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type DeleteTrainingDayExerciseFieldErrors,
    validateDeleteTrainingDayExerciseForm
} from '../lib/validation';

export type DeleteTrainingDayExerciseActionState = {
    error?: string;
    fieldErrors?: DeleteTrainingDayExerciseFieldErrors;
};

export async function deleteTrainingDayExerciseAction(
    formData: FormData
): Promise<DeleteTrainingDayExerciseActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateDeleteTrainingDayExerciseForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await deleteTrainingDayExercise({ coachId: user.id, ...validation.data });

    if (!result.ok) {
        return { error: TrainingBlockNotFoundMessages.TrainingDayExercise };
    }

    revalidateTrainingBlockNow({ trainingBlockId: validation.data.trainingBlockId });
    return {};
}
