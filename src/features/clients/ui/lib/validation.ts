import 'server-only';

import { z } from 'zod';

import { ClientStatus } from '../../domain/client';

export type CreateClientFieldErrors = {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    phone?: string[];
    startedAt?: string[];
};

export type UpdateClientFieldErrors = CreateClientFieldErrors & {
    clientId?: string[];
    status?: string[];
};

const clientSchema = z.object({
    firstName: z.string().trim().min(1, 'Podaj imię.').max(100, 'Imię jest zbyt długie.'),
    lastName: z.string().trim().min(1, 'Podaj nazwisko.').max(100, 'Nazwisko jest zbyt długie.'),
    email: z.email('Podaj prawidłowy adres e-mail.').max(320, 'Adres e-mail jest zbyt długi.'),
    phone: z
        .string()
        .trim()
        .max(50, 'Numer telefonu jest zbyt długi.')
        .transform(value => value || null),
    startedAt: z.iso.date('Podaj prawidłową datę rozpoczęcia współpracy.')
});

const updateClientSchema = clientSchema.extend({
    clientId: z.uuid('Nieprawidłowy identyfikator podopiecznego.'),
    status: z.enum([ClientStatus.Active, ClientStatus.Paused, ClientStatus.Ended], {
        error: 'Wybierz status współpracy.'
    })
});

const clientIdSchema = z.uuid();

export function validateClientId({ clientId }: { clientId: string }) {
    const result = clientIdSchema.safeParse(clientId);

    if (!result.success) {
        return { ok: false as const };
    }

    return { ok: true as const, data: result.data };
}

export function validateCreateClientForm(data: FormData) {
    const result = clientSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: result.error.flatten().fieldErrors satisfies CreateClientFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateUpdateClientForm(data: FormData) {
    const result = updateClientSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: result.error.flatten().fieldErrors satisfies UpdateClientFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}
