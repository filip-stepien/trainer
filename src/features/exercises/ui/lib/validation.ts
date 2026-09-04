import 'server-only';

import { z } from 'zod';

import { ExerciseStatus } from '../../domain/exercise';
import {
    ExerciseListStatus,
    ExerciseListView,
    type ExerciseListStatus as ExerciseListStatusValue,
    type ExerciseListView as ExerciseListViewValue
} from './routes';

export type ExerciseFieldErrors = {
    name?: string[];
    instructions?: string[];
    videoUrl?: string[];
};

export type UpdateExerciseFieldErrors = ExerciseFieldErrors & {
    exerciseId?: string[];
};

export type SetExerciseStatusFieldErrors = {
    exerciseId?: string[];
    status?: string[];
};

export type AddExerciseFromCatalogFieldErrors = {
    sourceExerciseId?: string[];
};

export type ExerciseListSearchParams = {
    page?: string | string[];
    search?: string | string[];
    status?: string | string[];
    view?: string | string[];
};

const exerciseSchema = z.object({
    name: z.string().trim().min(1, 'Podaj nazwę ćwiczenia.').max(150, 'Nazwa jest zbyt długa.'),
    instructions: z
        .string()
        .trim()
        .max(5000, 'Instrukcja jest zbyt długa.')
        .transform(value => value || null),
    videoUrl: z
        .union([
            z.literal(''),
            z
                .httpUrl('Podaj prawidłowy adres HTTP lub HTTPS.')
                .max(2048, 'Adres filmu jest zbyt długi.')
        ])
        .transform(value => value || null)
});

const updateExerciseSchema = exerciseSchema.extend({
    exerciseId: z.uuid('Nieprawidłowy identyfikator ćwiczenia.')
});

const setExerciseStatusSchema = z.object({
    exerciseId: z.uuid('Nieprawidłowy identyfikator ćwiczenia.'),
    status: z.enum([ExerciseStatus.Active, ExerciseStatus.Archived])
});

const addExerciseFromCatalogSchema = z.object({
    sourceExerciseId: z.guid('Nieprawidłowy identyfikator ćwiczenia.')
});

const exerciseIdSchema = z.uuid();

const exerciseListSearchParamsSchema = z.object({
    page: z.coerce.number().int().min(1).catch(1),
    search: z.string().trim().max(150).catch(''),
    status: z
        .enum([ExerciseListStatus.Active, ExerciseListStatus.Archived, ExerciseListStatus.All])
        .catch(ExerciseListStatus.Active),
    view: z
        .enum([ExerciseListView.Library, ExerciseListView.Catalog])
        .catch(ExerciseListView.Library)
});

function getFirstValue(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

export function validateExerciseId({ exerciseId }: { exerciseId: string }) {
    const result = exerciseIdSchema.safeParse(exerciseId);

    if (!result.success) {
        return { ok: false as const };
    }

    return { ok: true as const, data: result.data };
}

export function validateCreateExerciseForm(data: FormData) {
    const result = exerciseSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: result.error.flatten().fieldErrors satisfies ExerciseFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateUpdateExerciseForm(data: FormData) {
    const result = updateExerciseSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: result.error.flatten().fieldErrors satisfies UpdateExerciseFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateSetExerciseStatusForm(data: FormData) {
    const result = setExerciseStatusSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: result.error.flatten().fieldErrors satisfies SetExerciseStatusFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateAddExerciseFromCatalogForm(data: FormData) {
    const result = addExerciseFromCatalogSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: result.error.flatten()
                .fieldErrors satisfies AddExerciseFromCatalogFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateExerciseListSearchParams(data: ExerciseListSearchParams) {
    return exerciseListSearchParamsSchema.parse({
        page: getFirstValue(data.page),
        search: getFirstValue(data.search),
        status: getFirstValue(data.status),
        view: getFirstValue(data.view)
    }) satisfies {
        page: number;
        search: string;
        status: ExerciseListStatusValue;
        view: ExerciseListViewValue;
    };
}
