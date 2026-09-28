'use server';

import { getCurrentUser } from '@/features/auth/server';

import { ClientErrorCode } from '../../domain/errors';
import { createClient } from '../../composition';
import { redirectToClient } from '../lib/navigation';
import { revalidateClientListNow } from '../lib/revalidation';
import { type CreateClientFieldErrors, validateCreateClientForm } from '../lib/validation';

const CreateClientActionMessages = {
    SessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    EmailAlreadyInUse: 'Podopieczny z tym adresem e-mail już istnieje.',
    Unknown: 'Nie udało się dodać podopiecznego.'
} as const;

export type CreateClientActionState = {
    error?: string;
    fieldErrors?: CreateClientFieldErrors;
};

export async function createClientAction(formData: FormData): Promise<CreateClientActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { error: CreateClientActionMessages.SessionExpired };
    }

    const validation = validateCreateClientForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await createClient({ coachId: user.id, data: validation.data });

    if (!result.ok) {
        if (result.error === ClientErrorCode.EmailAlreadyInUse) {
            return { fieldErrors: { email: [CreateClientActionMessages.EmailAlreadyInUse] } };
        }
        return { error: CreateClientActionMessages.Unknown };
    }

    revalidateClientListNow();
    redirectToClient({ clientId: result.value.id });
}
