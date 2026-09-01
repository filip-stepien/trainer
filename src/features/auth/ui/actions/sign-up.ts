'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { AuthErrorCode } from '../../domain/errors';
import { signUp } from '../..';

export type SignUpActionState = {
    error?: string;
};

const errorMessages: Partial<Record<AuthErrorCode, string>> = {
    [AuthErrorCode.EmailAlreadyInUse]: 'Konto z tym adresem e-mail już istnieje.',
    [AuthErrorCode.WeakPassword]: 'Hasło jest zbyt słabe. Wybierz silniejsze.',
    [AuthErrorCode.RateLimited]: 'Zbyt wiele prób. Spróbuj ponownie za chwilę.',
    [AuthErrorCode.Unknown]: 'Coś poszło nie tak. Spróbuj ponownie.'
};

const signUpSchema = z.object({
    email: z.email('Podaj prawidłowy adres e-mail.'),
    password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków.')
});

export async function signUpAction(formData: FormData): Promise<SignUpActionState> {
    const parsed = signUpSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message };
    }

    const result = await signUp(parsed.data);

    if (!result.ok) {
        return { error: errorMessages[result.error] ?? errorMessages[AuthErrorCode.Unknown] };
    }

    redirect('/');
}
