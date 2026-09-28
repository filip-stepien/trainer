'use server';

import { signIn } from '../../composition';
import { AuthErrorMessages } from '../lib/messages';
import { redirectToDashboard } from '../lib/navigation';
import { type SignInFieldErrors, validateSignInForm } from '../lib/validation';

export type SignInActionState = {
    error?: string;
    fieldErrors?: SignInFieldErrors;
};

export async function signInAction(formData: FormData): Promise<SignInActionState> {
    const validation = validateSignInForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const result = await signIn(validation.data);

    if (!result.ok) {
        return { error: AuthErrorMessages[result.error] };
    }

    redirectToDashboard();
}
