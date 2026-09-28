'use server';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { ClientErrorCode } from '../../domain/errors';
import { updateClient } from '../../composition';
import { ClientActionMessages, ClientErrorMessages } from '../lib/messages';
import { revalidateClientListNow, revalidateClientNow } from '../lib/revalidation';
import { type UpdateClientFieldErrors, validateUpdateClientForm } from '../lib/validation';

export type UpdateClientActionState = {
    error?: string;
    success?: string;
    fieldErrors?: UpdateClientFieldErrors;
};

export async function updateClientAction(formData: FormData): Promise<UpdateClientActionState> {
    const user = await getAuthenticatedUserOrRedirect();

    const validation = validateUpdateClientForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { clientId, ...data } = validation.data;
    const result = await updateClient({ coachId: user.id, clientId, data });

    if (!result.ok) {
        if (result.error === ClientErrorCode.EmailAlreadyInUse) {
            return { fieldErrors: { email: [ClientErrorMessages[result.error]] } };
        }
        return { error: ClientErrorMessages[result.error] };
    }

    revalidateClientListNow();
    revalidateClientNow({ clientId });
    return { success: ClientActionMessages.Saved };
}
