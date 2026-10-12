'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { createTrainingBlock } from '../../composition';
import { TrainingBlockErrorCode } from '../../domain/errors';
import { TrainingBlockActionMessages, TrainingBlockNotFoundMessages } from '../lib/messages';
import { redirectToTrainingBlock } from '../lib/navigation';
import { revalidateClientNow } from '../lib/revalidation';
import {
    type CreateTrainingBlockFieldErrors,
    validateCreateTrainingBlockForm
} from '../lib/validation';

export type CreateTrainingBlockActionState = {
    error?: string;
    fieldErrors?: CreateTrainingBlockFieldErrors;
};

export async function createTrainingBlockAction(
    formData: FormData
): Promise<CreateTrainingBlockActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateCreateTrainingBlockForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { clientId, ...data } = validation.data;
    const result = await createTrainingBlock({ coachId: user.id, clientId, data });

    if (!result.ok) {
        if (result.error === TrainingBlockErrorCode.ClientNotFound) {
            return { error: TrainingBlockNotFoundMessages.Client };
        }
        return { error: TrainingBlockActionMessages.CreateFailed };
    }

    revalidateClientNow({ clientId });
    redirectToTrainingBlock({ trainingBlockId: result.value.id });
}
