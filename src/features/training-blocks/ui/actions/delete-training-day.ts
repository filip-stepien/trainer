'use server';

import { getCurrentUser } from '@/features/auth/server';

import { deleteTrainingDay } from '../../composition';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type DeleteTrainingDayFieldErrors,
    validateDeleteTrainingDayForm
} from '../lib/validation';

const DeleteTrainingDayActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    NotFound: 'Nie znaleziono dnia w roboczej wersji bloku.'
} as const;

export type DeleteTrainingDayActionState = {
    error?: string;
    fieldErrors?: DeleteTrainingDayFieldErrors;
};

export async function deleteTrainingDayAction(
    formData: FormData
): Promise<DeleteTrainingDayActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: DeleteTrainingDayActionMessages.SessionExpired };
    }

    const validation = validateDeleteTrainingDayForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await deleteTrainingDay({ coachId: user.id, ...validation.data });

    if (!result.ok) {
        return { error: DeleteTrainingDayActionMessages.NotFound };
    }

    revalidateTrainingBlockNow({ trainingBlockId: validation.data.trainingBlockId });
    return {};
}
