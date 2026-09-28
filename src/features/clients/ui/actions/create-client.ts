'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { ClientErrorCode } from '../../domain/errors';
import { createClient } from '../../composition';
import { ClientActionMessages, ClientErrorMessages } from '../lib/messages';
import { redirectToClient } from '../lib/navigation';
import { revalidateClientListNow } from '../lib/revalidation';
import { type CreateClientFieldErrors, validateCreateClientForm } from '../lib/validation';

export type CreateClientActionState = {
    error?: string;
    fieldErrors?: CreateClientFieldErrors;
};

export async function createClientAction(formData: FormData): Promise<CreateClientActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateCreateClientForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await createClient({ coachId: user.id, data: validation.data });

    if (!result.ok) {
        if (result.error === ClientErrorCode.EmailAlreadyInUse) {
            return { fieldErrors: { email: [ClientErrorMessages[result.error]] } };
        }
        return { error: ClientActionMessages.CreateFailed };
    }

    revalidateClientListNow();
    redirectToClient({ clientId: result.value.id });
}
