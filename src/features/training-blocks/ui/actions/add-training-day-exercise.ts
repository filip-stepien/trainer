'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { addTrainingDayExercise } from '../../composition';
import { TrainingBlockErrorCode } from '../../domain/errors';
import { TrainingBlockActionMessages, TrainingBlockNotFoundMessages } from '../lib/messages';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type AddTrainingDayExerciseFieldErrors,
    validateAddTrainingDayExerciseForm
} from '../lib/validation';

export type AddTrainingDayExerciseActionState = {
    error?: string;
    success?: string;
    fieldErrors?: AddTrainingDayExerciseFieldErrors;
};

export async function addTrainingDayExerciseAction(
    formData: FormData
): Promise<AddTrainingDayExerciseActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateAddTrainingDayExerciseForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { trainingBlockId, trainingDayId, ...data } = validation.data;
    const result = await addTrainingDayExercise({
        coachId: user.id,
        trainingBlockId,
        trainingDayId,
        data
    });

    if (!result.ok) {
        return {
            error:
                result.error === TrainingBlockErrorCode.ExerciseNotFound
                    ? TrainingBlockNotFoundMessages.LibraryExercise
                    : TrainingBlockNotFoundMessages.TrainingDay
        };
    }

    revalidateTrainingBlockNow({ trainingBlockId });
    return { success: TrainingBlockActionMessages.TrainingDayExerciseAdded };
}
