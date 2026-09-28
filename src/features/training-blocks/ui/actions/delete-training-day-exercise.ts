'use server';

import { getCurrentUser } from '@/features/auth/server';

import { deleteTrainingDayExercise } from '../../composition';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type DeleteTrainingDayExerciseFieldErrors,
    validateDeleteTrainingDayExerciseForm
} from '../lib/validation';

const DeleteTrainingDayExerciseActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    NotFound: 'Nie znaleziono ćwiczenia w roboczej wersji bloku.'
} as const;

export type DeleteTrainingDayExerciseActionState = {
    error?: string;
    fieldErrors?: DeleteTrainingDayExerciseFieldErrors;
};

export async function deleteTrainingDayExerciseAction(
    formData: FormData
): Promise<DeleteTrainingDayExerciseActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: DeleteTrainingDayExerciseActionMessages.SessionExpired };
    }

    const validation = validateDeleteTrainingDayExerciseForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await deleteTrainingDayExercise({ coachId: user.id, ...validation.data });

    if (!result.ok) {
        return { error: DeleteTrainingDayExerciseActionMessages.NotFound };
    }

    revalidateTrainingBlockNow({ trainingBlockId: validation.data.trainingBlockId });
    return {};
}
