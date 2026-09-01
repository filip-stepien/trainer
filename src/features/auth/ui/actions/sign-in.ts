'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { AuthErrorCode } from '../../domain/errors';
import { signIn } from '../..';

export type SignInActionState = {
    error?: string;
};

const errorMessages: Partial<Record<AuthErrorCode, string>> = {
    [AuthErrorCode.InvalidCredentials]: 'Nieprawidłowy adres e-mail lub hasło.',
    [AuthErrorCode.RateLimited]: 'Zbyt wiele prób. Spróbuj ponownie za chwilę.',
    [AuthErrorCode.Unknown]: 'Coś poszło nie tak. Spróbuj ponownie.'
};

const signInSchema = z.object({
    email: z.email('Podaj prawidłowy adres e-mail.'),
    password: z.string().min(1, 'Podaj hasło.')
});

export async function signInAction(formData: FormData): Promise<SignInActionState> {
    const parsed = signInSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message };
    }

    const result = await signIn(parsed.data);

    if (!result.ok) {
        return { error: errorMessages[result.error] ?? errorMessages[AuthErrorCode.Unknown] };
    }

    redirect('/dashboard');
}
