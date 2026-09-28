'use server';

import { getCurrentUser } from '@/features/auth/server';

import { addTrainingDayExercise } from '../../composition';
import { TrainingBlockErrorCode } from '../../domain/errors';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type AddTrainingDayExerciseFieldErrors,
    validateAddTrainingDayExerciseForm
} from '../lib/validation';

const AddTrainingDayExerciseActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    ExerciseNotFound: 'Nie znaleziono aktywnego ćwiczenia w Twojej bibliotece.',
    TrainingDayNotFound: 'Nie znaleziono dnia w roboczej wersji bloku.',
    Added: 'Ćwiczenie zostało dodane.'
} as const;

export type AddTrainingDayExerciseActionState = {
    error?: string;
    success?: string;
    fieldErrors?: AddTrainingDayExerciseFieldErrors;
};

export async function addTrainingDayExerciseAction(
    formData: FormData
): Promise<AddTrainingDayExerciseActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: AddTrainingDayExerciseActionMessages.SessionExpired };
    }

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
                    ? AddTrainingDayExerciseActionMessages.ExerciseNotFound
                    : AddTrainingDayExerciseActionMessages.TrainingDayNotFound
        };
    }

    revalidateTrainingBlockNow({ trainingBlockId });
    return { success: AddTrainingDayExerciseActionMessages.Added };
}
