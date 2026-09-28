import 'server-only';

import { z } from 'zod';

const emailSchema = z.email('Podaj prawidłowy adres e-mail.');

const signInSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Podaj hasło.')
});

const signUpSchema = z.object({
    firstName: z.string().min(1, 'Podaj imię.'),
    lastName: z.string().min(1, 'Podaj nazwisko.'),
    email: emailSchema,
    password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków.')
});

export type SignInFieldErrors = {
    email?: string[];
    password?: string[];
};

export type SignUpFieldErrors = SignInFieldErrors & {
    firstName?: string[];
    lastName?: string[];
};

export function validateSignInForm(data: FormData) {
    const result = signInSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error).fieldErrors satisfies SignInFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateSignUpForm(data: FormData) {
    const result = signUpSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error).fieldErrors satisfies SignUpFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}
