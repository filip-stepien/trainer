'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { updateExercise } from '../../composition';
import { ExerciseActionMessages, ExerciseErrorMessages } from '../lib/messages';
import { revalidateExerciseListNow, revalidateExerciseNow } from '../lib/revalidation';
import { type UpdateExerciseFieldErrors, validateUpdateExerciseForm } from '../lib/validation';

export type UpdateExerciseActionState = {
    error?: string;
    success?: string;
    fieldErrors?: UpdateExerciseFieldErrors;
};

export async function updateExerciseAction(formData: FormData): Promise<UpdateExerciseActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateUpdateExerciseForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { exerciseId, ...data } = validation.data;
    const result = await updateExercise({ coachId: user.id, exerciseId, data });

    if (!result.ok) {
        return { error: ExerciseErrorMessages[result.error] };
    }

    revalidateExerciseListNow();
    revalidateExerciseNow({ exerciseId });
    return { success: ExerciseActionMessages.Saved };
}
