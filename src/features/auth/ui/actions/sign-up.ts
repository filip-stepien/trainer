'use server';

import { signUp } from '../../composition';
import { AuthErrorMessages } from '../lib/messages';
import { redirectToHome } from '../lib/navigation';
import { type SignUpFieldErrors, validateSignUpForm } from '../lib/validation';

export type SignUpActionState = {
    error?: string;
    fieldErrors?: SignUpFieldErrors;
};

export async function signUpAction(formData: FormData): Promise<SignUpActionState> {
    const validation = validateSignUpForm(formData);

    if (!validation.ok) {
        return { fieldErrors: validation.fieldErrors };
    }

    const { firstName, lastName, email, password } = validation.data;

    const result = await signUp({ name: `${firstName} ${lastName}`, email, password });

    if (!result.ok) {
        return { error: AuthErrorMessages[result.error] };
    }

    redirectToHome();
}
