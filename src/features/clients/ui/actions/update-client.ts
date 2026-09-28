'use server';

import { getCurrentUser } from '@/features/auth/server';

import { ClientErrorCode } from '../../domain/errors';
import { updateClient } from '../../composition';
import { revalidateClientListNow, revalidateClientNow } from '../lib/revalidation';
import { type UpdateClientFieldErrors, validateUpdateClientForm } from '../lib/validation';

const UpdateClientActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    EmailAlreadyInUse: 'Podopieczny z tym adresem e-mail już istnieje.',
    NotFound: 'Nie znaleziono podopiecznego.',
    Saved: 'Dane podopiecznego zostały zapisane.'
} as const;

export type UpdateClientActionState = {
    error?: string;
    success?: string;
    fieldErrors?: UpdateClientFieldErrors;
};

export async function updateClientAction(formData: FormData): Promise<UpdateClientActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: UpdateClientActionMessages.SessionExpired };
    }

    const validation = validateUpdateClientForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { clientId, ...data } = validation.data;
    const result = await updateClient({ coachId: user.id, clientId, data });

    if (!result.ok) {
        if (result.error === ClientErrorCode.EmailAlreadyInUse) {
            return { fieldErrors: { email: [UpdateClientActionMessages.EmailAlreadyInUse] } };
        }
        if (result.error === ClientErrorCode.NotFound) {
            return { error: UpdateClientActionMessages.NotFound };
        }
    }

    revalidateClientListNow();
    revalidateClientNow({ clientId });
    return { success: UpdateClientActionMessages.Saved };
}
