'use server';

import { getCurrentUser } from '@/features/auth/server';

import { updateTrainingDayExercise } from '../../composition';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type UpdateTrainingDayExerciseFieldErrors,
    validateUpdateTrainingDayExerciseForm
} from '../lib/validation';

const UpdateTrainingDayExerciseActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    NotFound: 'Nie znaleziono ćwiczenia w roboczej wersji bloku.',
    Saved: 'Zalecenia zostały zapisane.'
} as const;

export type UpdateTrainingDayExerciseActionState = {
    error?: string;
    success?: string;
    fieldErrors?: UpdateTrainingDayExerciseFieldErrors;
};

export async function updateTrainingDayExerciseAction(
    formData: FormData
): Promise<UpdateTrainingDayExerciseActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: UpdateTrainingDayExerciseActionMessages.SessionExpired };
    }

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
        return { error: UpdateTrainingDayExerciseActionMessages.NotFound };
    }

    revalidateTrainingBlockNow({ trainingBlockId });
    return { success: UpdateTrainingDayExerciseActionMessages.Saved };
}
