'use server';

import { getCurrentUser } from '@/features/auth/server';

import { moveTrainingDayExercise } from '../../composition';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type MoveTrainingDayExerciseFieldErrors,
    validateMoveTrainingDayExerciseForm
} from '../lib/validation';

const MoveTrainingDayExerciseActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    NotFound: 'Nie udało się zmienić kolejności ćwiczeń.'
} as const;

export type MoveTrainingDayExerciseActionState = {
    error?: string;
    fieldErrors?: MoveTrainingDayExerciseFieldErrors;
};

export async function moveTrainingDayExerciseAction(
    formData: FormData
): Promise<MoveTrainingDayExerciseActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: MoveTrainingDayExerciseActionMessages.SessionExpired };
    }

    const validation = validateMoveTrainingDayExerciseForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await moveTrainingDayExercise({ coachId: user.id, ...validation.data });

    if (!result.ok) {
        return { error: MoveTrainingDayExerciseActionMessages.NotFound };
    }

    revalidateTrainingBlockNow({ trainingBlockId: validation.data.trainingBlockId });
    return {};
}
