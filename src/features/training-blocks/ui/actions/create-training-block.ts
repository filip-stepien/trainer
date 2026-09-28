'use server';

import { getCurrentUser } from '@/features/auth/server';

import { createTrainingBlock } from '../../composition';
import { TrainingBlockErrorCode } from '../../domain/errors';
import { redirectToTrainingBlock } from '../lib/navigation';
import { revalidateClientTrainingNow } from '../lib/revalidation';
import {
    type CreateTrainingBlockFieldErrors,
    validateCreateTrainingBlockForm
} from '../lib/validation';

const CreateTrainingBlockActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    ClientNotFound: 'Nie znaleziono podopiecznego.',
    Unknown: 'Nie udało się utworzyć bloku treningowego.'
} as const;

export type CreateTrainingBlockActionState = {
    error?: string;
    fieldErrors?: CreateTrainingBlockFieldErrors;
};

export async function createTrainingBlockAction(
    formData: FormData
): Promise<CreateTrainingBlockActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: CreateTrainingBlockActionMessages.SessionExpired };
    }

    const validation = validateCreateTrainingBlockForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { clientId, ...data } = validation.data;
    const result = await createTrainingBlock({ coachId: user.id, clientId, data });

    if (!result.ok) {
        if (result.error === TrainingBlockErrorCode.ClientNotFound) {
            return { error: CreateTrainingBlockActionMessages.ClientNotFound };
        }
        return { error: CreateTrainingBlockActionMessages.Unknown };
    }

    revalidateClientTrainingNow({ clientId });
    redirectToTrainingBlock({ trainingBlockId: result.value.id });
}
