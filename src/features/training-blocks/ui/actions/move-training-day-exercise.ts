'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { moveTrainingDayExercise } from '../../composition';
import { TrainingBlockNotFoundMessages } from '../lib/messages';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type MoveTrainingDayExerciseFieldErrors,
    validateMoveTrainingDayExerciseForm
} from '../lib/validation';

export type MoveTrainingDayExerciseActionState = {
    error?: string;
    fieldErrors?: MoveTrainingDayExerciseFieldErrors;
};

export async function moveTrainingDayExerciseAction(
    formData: FormData
): Promise<MoveTrainingDayExerciseActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateMoveTrainingDayExerciseForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await moveTrainingDayExercise({ coachId: user.id, ...validation.data });

    if (!result.ok) {
        return { error: TrainingBlockNotFoundMessages.TrainingDayExercise };
    }

    revalidateTrainingBlockNow({ trainingBlockId: validation.data.trainingBlockId });
    return {};
}
