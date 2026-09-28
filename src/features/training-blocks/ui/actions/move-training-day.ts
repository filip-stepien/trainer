'use server';

import { getCurrentUser } from '@/features/auth/server';

import { moveTrainingDay } from '../../composition';
import { revalidateTrainingBlockNow } from '../lib/revalidation';
import { type MoveTrainingDayFieldErrors, validateMoveTrainingDayForm } from '../lib/validation';

const MoveTrainingDayActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    NotFound: 'Nie udało się zmienić kolejności dni.'
} as const;

export type MoveTrainingDayActionState = {
    error?: string;
    fieldErrors?: MoveTrainingDayFieldErrors;
};

export async function moveTrainingDayAction(
    formData: FormData
): Promise<MoveTrainingDayActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: MoveTrainingDayActionMessages.SessionExpired };
    }

    const validation = validateMoveTrainingDayForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await moveTrainingDay({ coachId: user.id, ...validation.data });

    if (!result.ok) {
        return { error: MoveTrainingDayActionMessages.NotFound };
    }

    revalidateTrainingBlockNow({ trainingBlockId: validation.data.trainingBlockId });
    return {};
}
