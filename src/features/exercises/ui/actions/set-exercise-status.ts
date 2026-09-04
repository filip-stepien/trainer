'use server';

import { getCurrentUser } from '@/features/auth/server';

import { setExerciseStatus } from '../../composition';
import { revalidateExerciseListNow, revalidateExerciseNow } from '../lib/revalidation';
import { validateSetExerciseStatusForm } from '../lib/validation';

export type SetExerciseStatusActionState = {
    error?: string;
};

const SetExerciseStatusActionError = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    InvalidData: 'Nieprawidłowe dane ćwiczenia.',
    NotFound: 'Nie znaleziono ćwiczenia.'
} as const;

export async function setExerciseStatusAction(
    formData: FormData
): Promise<SetExerciseStatusActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: SetExerciseStatusActionError.SessionExpired };
    }

    const validation = validateSetExerciseStatusForm(formData);

    if (!validation.ok) {
        return { error: SetExerciseStatusActionError.InvalidData };
    }

    const { exerciseId, status } = validation.data;
    const result = await setExerciseStatus({ coachId: user.id, exerciseId, status });

    if (!result.ok) {
        return { error: SetExerciseStatusActionError.NotFound };
    }

    revalidateExerciseListNow();
    revalidateExerciseNow({ exerciseId });
    return {};
}
