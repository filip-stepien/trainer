'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { createExercise } from '../../composition';
import { ExerciseActionMessages } from '../lib/messages';
import { redirectToExercise } from '../lib/navigation';
import { revalidateExerciseListNow } from '../lib/revalidation';
import { type ExerciseFieldErrors, validateCreateExerciseForm } from '../lib/validation';

export type CreateExerciseActionState = {
    error?: string;
    fieldErrors?: ExerciseFieldErrors;
};

export async function createExerciseAction(formData: FormData): Promise<CreateExerciseActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateCreateExerciseForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await createExercise({ coachId: user.id, data: validation.data });

    if (!result.ok) {
        return { error: ExerciseActionMessages.CreateFailed };
    }

    revalidateExerciseListNow();
    redirectToExercise({ exerciseId: result.value.id });
}
