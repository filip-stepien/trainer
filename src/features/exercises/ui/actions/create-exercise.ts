'use server';

import { getCurrentUser } from '@/features/auth/server';

import { createExercise } from '../../composition';
import { redirectToExercise } from '../lib/navigation';
import { revalidateExerciseListNow } from '../lib/revalidation';
import { type ExerciseFieldErrors, validateCreateExerciseForm } from '../lib/validation';

export type CreateExerciseActionState = {
    error?: string;
    fieldErrors?: ExerciseFieldErrors;
};

const CreateExerciseActionError = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    SaveFailed: 'Nie udało się dodać ćwiczenia.'
} as const;

export async function createExerciseAction(formData: FormData): Promise<CreateExerciseActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: CreateExerciseActionError.SessionExpired };
    }

    const validation = validateCreateExerciseForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await createExercise({ coachId: user.id, data: validation.data });

    if (!result.ok) {
        return { error: CreateExerciseActionError.SaveFailed };
    }

    revalidateExerciseListNow();
    redirectToExercise({ exerciseId: result.value.id });
}
