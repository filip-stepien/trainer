'use server';

import { AuthErrorCode } from '../../domain/errors';
import { signUp } from '../../composition';
import { redirectToHome } from '../lib/navigation';
import { validateSignUpForm } from '../lib/validation';

export type SignUpActionState = {
    error?: string;
};

const errorMessages: Partial<Record<AuthErrorCode, string>> = {
    [AuthErrorCode.EmailAlreadyInUse]: 'Konto z tym adresem e-mail już istnieje.',
    [AuthErrorCode.WeakPassword]: 'Hasło jest zbyt słabe. Wybierz silniejsze.',
    [AuthErrorCode.RateLimited]: 'Zbyt wiele prób. Spróbuj ponownie za chwilę.',
    [AuthErrorCode.Unknown]: 'Coś poszło nie tak. Spróbuj ponownie.'
};

export async function signUpAction(formData: FormData): Promise<SignUpActionState> {
    const validation = validateSignUpForm(formData);

    if (!validation.ok) {
        return { error: validation.error };
    }

    const { firstName, lastName, email, password } = validation.data;

    const result = await signUp({ name: `${firstName} ${lastName}`, email, password });

    if (!result.ok) {
        return { error: errorMessages[result.error] ?? errorMessages[AuthErrorCode.Unknown] };
    }

    redirectToHome();
}
