'use server';

import { getCurrentUser } from '@/features/auth/server';

import { ClientErrorCode } from '../../domain/errors';
import { updateClient } from '../../composition';
import { revalidateClientListNow, revalidateClientNow } from '../lib/revalidation';
import { type UpdateClientFieldErrors, validateUpdateClientForm } from '../lib/validation';

export type UpdateClientActionState = {
    error?: string;
    success?: string;
    fieldErrors?: UpdateClientFieldErrors;
};

export async function updateClientAction(formData: FormData): Promise<UpdateClientActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: 'Sesja wygasła. Zaloguj się ponownie.' };
    }

    const validation = validateUpdateClientForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { clientId, ...data } = validation.data;
    const result = await updateClient({ coachId: user.id, clientId, data });

    if (!result.ok) {
        if (result.error === ClientErrorCode.EmailAlreadyInUse) {
            return { fieldErrors: { email: ['Podopieczny z tym adresem e-mail już istnieje.'] } };
        }
        if (result.error === ClientErrorCode.NotFound) {
            return { error: 'Nie znaleziono podopiecznego.' };
        }
    }

    revalidateClientListNow();
    revalidateClientNow({ clientId });
    return { success: 'Dane podopiecznego zostały zapisane.' };
}
