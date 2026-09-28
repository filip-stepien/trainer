'use server';

import { getCurrentUser } from '@/features/auth/server';

import { updateTrainingBlock } from '../../composition';
import { revalidateClientTrainingNow, revalidateTrainingBlockNow } from '../lib/revalidation';
import {
    type UpdateTrainingBlockFieldErrors,
    validateUpdateTrainingBlockForm
} from '../lib/validation';

const UpdateTrainingBlockActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    NotFound: 'Nie znaleziono roboczej wersji bloku.',
    Saved: 'Blok treningowy został zapisany.'
} as const;

export type UpdateTrainingBlockActionState = {
    error?: string;
    success?: string;
    fieldErrors?: UpdateTrainingBlockFieldErrors;
};

export async function updateTrainingBlockAction(
    formData: FormData
): Promise<UpdateTrainingBlockActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: UpdateTrainingBlockActionMessages.SessionExpired };
    }

    const validation = validateUpdateTrainingBlockForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { trainingBlockId, ...data } = validation.data;
    const result = await updateTrainingBlock({ coachId: user.id, trainingBlockId, data });

    if (!result.ok) {
        return { error: UpdateTrainingBlockActionMessages.NotFound };
    }

    revalidateClientTrainingNow({ clientId: result.value.clientId });
    revalidateTrainingBlockNow({ trainingBlockId });
    return { success: UpdateTrainingBlockActionMessages.Saved };
}
