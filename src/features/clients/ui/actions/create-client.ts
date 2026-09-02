'use server';

import { getCurrentUser } from '@/features/auth/server';

import { ClientErrorCode } from '../../domain/errors';
import { createClient } from '../../composition';
import { redirectToClient } from '../lib/navigation';
import { revalidateClientListNow } from '../lib/revalidation';
import { type CreateClientFieldErrors, validateCreateClientForm } from '../lib/validation';

export type CreateClientActionState = {
    error?: string;
    fieldErrors?: CreateClientFieldErrors;
};

export async function createClientAction(formData: FormData): Promise<CreateClientActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: 'Sesja wygasła. Zaloguj się ponownie.' };
    }

    const validation = validateCreateClientForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await createClient({ coachId: user.id, data: validation.data });

    if (!result.ok) {
        if (result.error === ClientErrorCode.EmailAlreadyInUse) {
            return { fieldErrors: { email: ['Podopieczny z tym adresem e-mail już istnieje.'] } };
        }
        return { error: 'Nie udało się dodać podopiecznego.' };
    }

    revalidateClientListNow();
    redirectToClient({ clientId: result.value.id });
}
