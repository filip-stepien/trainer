import 'server-only';

import { z } from 'zod';

const signInSchema = z.object({
    email: z.email('Podaj prawidłowy adres e-mail.'),
    password: z.string().min(1, 'Podaj hasło.')
});

const signUpSchema = z.object({
    firstName: z.string().min(1, 'Podaj imię.'),
    lastName: z.string().min(1, 'Podaj nazwisko.'),
    email: z.email('Podaj prawidłowy adres e-mail.'),
    password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków.')
});

function toValidationResult<T>(result: z.ZodSafeParseResult<T>) {
    if (!result.success) {
        return {
            ok: false as const,
            error: result.error.issues[0]?.message ?? 'Podane dane są nieprawidłowe.'
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateSignInForm(data: FormData) {
    return toValidationResult(signInSchema.safeParse(Object.fromEntries(data)));
}

export function validateSignUpForm(data: FormData) {
    return toValidationResult(signUpSchema.safeParse(Object.fromEntries(data)));
}
