import 'server-only';

import { z } from 'zod';

import { ClientStatus } from '../../domain/client';

function validateCollaborationPeriod(data: z.infer<typeof clientSchema>, context: z.RefinementCtx) {
    if (data.endsAt !== null && data.endsAt < data.startedAt) {
        context.addIssue({
            code: 'custom',
            path: ['endsAt'],
            message: 'Koniec współpracy nie może być wcześniejszy niż jej początek.'
        });
    }
}

const clientIdSchema = z.uuid('Nieprawidłowy identyfikator podopiecznego.');

const clientSchema = z.object({
    firstName: z.string().trim().min(1, 'Podaj imię.').max(100, 'Imię jest zbyt długie.'),
    lastName: z.string().trim().min(1, 'Podaj nazwisko.').max(100, 'Nazwisko jest zbyt długie.'),
    email: z.email('Podaj prawidłowy adres e-mail.').max(320, 'Adres e-mail jest zbyt długi.'),
    phone: z
        .string()
        .trim()
        .max(50, 'Numer telefonu jest zbyt długi.')
        .transform(value => value || null),
    startedAt: z.iso.date('Podaj prawidłową datę rozpoczęcia współpracy.'),
    endsAt: z.preprocess(
        value => (value === '' ? null : value),
        z.iso.date('Podaj prawidłową datę zakończenia współpracy.').nullable()
    )
});

const createClientSchema = clientSchema.superRefine(validateCollaborationPeriod);

const updateClientSchema = clientSchema
    .extend({
        clientId: clientIdSchema,
        status: z.enum([ClientStatus.Active, ClientStatus.Paused, ClientStatus.Ended], {
            error: 'Wybierz status współpracy.'
        })
    })
    .superRefine(validateCollaborationPeriod);

export type CreateClientFieldErrors = {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    phone?: string[];
    startedAt?: string[];
    endsAt?: string[];
};

export type UpdateClientFieldErrors = CreateClientFieldErrors & {
    clientId?: string[];
    status?: string[];
};

export function validateClientId({ clientId }: { clientId: string }) {
    const result = clientIdSchema.safeParse(clientId);

    if (!result.success) {
        return { ok: false as const };
    }

    return { ok: true as const, data: result.data };
}

export function validateCreateClientForm(data: FormData) {
    const result = createClientSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error).fieldErrors satisfies CreateClientFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateUpdateClientForm(data: FormData) {
    const result = updateClientSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error).fieldErrors satisfies UpdateClientFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}
