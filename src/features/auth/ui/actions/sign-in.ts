'use server';

import { AuthErrorCode } from '../../domain/errors';
import { signIn } from '../../composition';
import { redirectToDashboard } from '../lib/navigation';
import { validateSignInForm } from '../lib/validation';

const SignInActionMessages: Partial<Record<AuthErrorCode, string>> = {
    [AuthErrorCode.InvalidCredentials]: 'Nieprawidłowy adres e-mail lub hasło.',
    [AuthErrorCode.RateLimited]: 'Zbyt wiele prób. Spróbuj ponownie za chwilę.',
    [AuthErrorCode.Unknown]: 'Coś poszło nie tak. Spróbuj ponownie.'
};

export type SignInActionState = {
    error?: string;
};

export async function signInAction(formData: FormData): Promise<SignInActionState> {
    const validation = validateSignInForm(formData);

    if (!validation.ok) {
        return { error: validation.error };
    }

    const result = await signIn(validation.data);

    if (!result.ok) {
        return {
            error: SignInActionMessages[result.error] ?? SignInActionMessages[AuthErrorCode.Unknown]
        };
    }

    redirectToDashboard();
}
