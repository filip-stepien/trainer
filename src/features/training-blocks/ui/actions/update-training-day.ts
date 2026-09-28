'use server';

import { getCurrentUser } from '@/features/auth/server';

import { updateTrainingDay } from '../../composition';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type UpdateTrainingDayFieldErrors,
    validateUpdateTrainingDayForm
} from '../lib/validation';

const UpdateTrainingDayActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    NotFound: 'Nie znaleziono dnia w roboczej wersji bloku.',
    Saved: 'Dzień treningowy został zapisany.'
} as const;

export type UpdateTrainingDayActionState = {
    error?: string;
    success?: string;
    fieldErrors?: UpdateTrainingDayFieldErrors;
};

export async function updateTrainingDayAction(
    formData: FormData
): Promise<UpdateTrainingDayActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: UpdateTrainingDayActionMessages.SessionExpired };
    }

    const validation = validateUpdateTrainingDayForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { trainingBlockId, trainingDayId, ...data } = validation.data;
    const result = await updateTrainingDay({
        coachId: user.id,
        trainingBlockId,
        trainingDayId,
        data
    });

    if (!result.ok) {
        return { error: UpdateTrainingDayActionMessages.NotFound };
    }

    revalidateTrainingBlockNow({ trainingBlockId });
    return { success: UpdateTrainingDayActionMessages.Saved };
}
