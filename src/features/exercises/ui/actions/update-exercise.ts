'use server';

import { getCurrentUser } from '@/features/auth/server';

import { updateExercise } from '../../composition';
import { revalidateExerciseListNow, revalidateExerciseNow } from '../lib/revalidation';
import { type UpdateExerciseFieldErrors, validateUpdateExerciseForm } from '../lib/validation';

const UpdateExerciseActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    NotFound: 'Nie znaleziono ćwiczenia.',
    Saved: 'Ćwiczenie zostało zapisane.'
} as const;

export type UpdateExerciseActionState = {
    error?: string;
    success?: string;
    fieldErrors?: UpdateExerciseFieldErrors;
};

export async function updateExerciseAction(formData: FormData): Promise<UpdateExerciseActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: UpdateExerciseActionMessages.SessionExpired };
    }

    const validation = validateUpdateExerciseForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { exerciseId, ...data } = validation.data;
    const result = await updateExercise({ coachId: user.id, exerciseId, data });

    if (!result.ok) {
        return { error: UpdateExerciseActionMessages.NotFound };
    }

    revalidateExerciseListNow();
    revalidateExerciseNow({ exerciseId });
    return { success: UpdateExerciseActionMessages.Saved };
}
