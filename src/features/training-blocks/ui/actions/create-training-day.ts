'use server';

import { getCurrentUser } from '@/features/auth/server';

import { createTrainingDay } from '../../composition';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type CreateTrainingDayFieldErrors,
    validateCreateTrainingDayForm
} from '../lib/validation';

const CreateTrainingDayActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    NotFound: 'Nie znaleziono roboczej wersji bloku.',
    Added: 'Dzień treningowy został dodany.'
} as const;

export type CreateTrainingDayActionState = {
    error?: string;
    success?: string;
    fieldErrors?: CreateTrainingDayFieldErrors;
};

export async function createTrainingDayAction(
    formData: FormData
): Promise<CreateTrainingDayActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: CreateTrainingDayActionMessages.SessionExpired };
    }

    const validation = validateCreateTrainingDayForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { trainingBlockId, ...data } = validation.data;
    const result = await createTrainingDay({ coachId: user.id, trainingBlockId, data });

    if (!result.ok) {
        return { error: CreateTrainingDayActionMessages.NotFound };
    }

    revalidateTrainingBlockNow({ trainingBlockId });
    return { success: CreateTrainingDayActionMessages.Added };
}
