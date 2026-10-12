import 'server-only';

import { z } from 'zod';

import { TrainingDayMoveDirection } from '../../domain/training-day';
import {
    TrainingDayExerciseMoveDirection,
    TrainingDayExerciseMoveScope,
    TrainingDayExerciseSection,
    TrainingDayExerciseTargetType
} from '../../domain/training-day-exercise';

function optionalNumber(schema: z.ZodType<number, unknown>) {
    return z.preprocess(
        value => (value === '' || value === undefined ? null : value),
        schema.nullable()
    );
}

function validateTrainingDayExerciseTarget(
    data: z.infer<typeof trainingDayExercisePrescriptionSchema>,
    context: z.RefinementCtx
) {
    if (data.targetType !== TrainingDayExerciseTargetType.Duration) {
        return;
    }

    data.sets.forEach((set, index) => {
        if (set.durationSeconds === null) {
            context.addIssue({
                code: 'custom',
                path: ['sets'],
                message: `Seria ${index + 1}: podaj czas pracy.`
            });
        }
    });
}

function readTrainingDayExerciseSets(data: FormData) {
    const reps = data.getAll('setReps');
    const durationSeconds = data.getAll('setDurationSeconds');
    const loadKg = data.getAll('setLoadKg');
    const rir = data.getAll('setRir');
    const setCount = Math.max(reps.length, durationSeconds.length, loadKg.length, rir.length);

    return Array.from({ length: setCount }, (_, index) => ({
        reps: String(reps[index] ?? ''),
        durationSeconds: String(durationSeconds[index] ?? ''),
        loadKg: String(loadKg[index] ?? ''),
        rir: String(rir[index] ?? '')
    }));
}

function getFirstValue(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

function readTrainingDayExerciseForm(data: FormData) {
    return { ...Object.fromEntries(data), sets: readTrainingDayExerciseSets(data) };
}

const clientIdSchema = z.uuid('Nieprawidłowy identyfikator podopiecznego.');

const trainingBlockIdSchema = z.uuid('Nieprawidłowy identyfikator bloku treningowego.');

const trainingDayIdSchema = z.uuid('Nieprawidłowy identyfikator dnia treningowego.');

const trainingDayExerciseIdSchema = z.uuid('Nieprawidłowy identyfikator ćwiczenia w planie.');

const trainingBlockSearchParamsSchema = z.object({
    day: trainingDayIdSchema.optional().catch(undefined),
    add: z
        .enum([TrainingDayExerciseSection.Warmup, TrainingDayExerciseSection.Main])
        .optional()
        .catch(undefined)
});

const trainingDayRefSchema = z.object({
    trainingBlockId: trainingBlockIdSchema,
    trainingDayId: trainingDayIdSchema
});

const trainingDayExerciseRefSchema = trainingDayRefSchema.extend({
    trainingDayExerciseId: trainingDayExerciseIdSchema
});

const trainingBlockSchema = z.object({
    name: z.string().trim().min(1, 'Podaj nazwę bloku.').max(150, 'Nazwa jest zbyt długa.'),
    startDate: z.iso.date('Podaj prawidłową datę rozpoczęcia.'),
    description: z
        .string()
        .trim()
        .max(5000, 'Opis jest zbyt długi.')
        .transform(value => value || null),
    durationWeeks: z.preprocess(
        value => (value === '' ? null : value),
        z.coerce
            .number('Podaj liczbę tygodni.')
            .int('Liczba tygodni musi być liczbą całkowitą.')
            .min(1, 'Blok musi trwać co najmniej tydzień.')
            .max(104, 'Blok nie może trwać dłużej niż 104 tygodnie.')
            .nullable()
    )
});

const createTrainingBlockSchema = trainingBlockSchema.extend({
    clientId: clientIdSchema
});

const updateTrainingBlockSchema = trainingBlockSchema.extend({
    trainingBlockId: trainingBlockIdSchema
});

const trainingDaySchema = z.object({
    name: z.string().trim().min(1, 'Podaj nazwę dnia.').max(150, 'Nazwa jest zbyt długa.'),
    description: z
        .string()
        .trim()
        .max(5000, 'Opis jest zbyt długi.')
        .transform(value => value || null)
});

const createTrainingDaySchema = trainingDaySchema.extend({
    trainingBlockId: trainingBlockIdSchema
});

const updateTrainingDaySchema = trainingDaySchema.extend(trainingDayRefSchema.shape);

const moveTrainingDaySchema = trainingDayRefSchema.extend({
    direction: z.enum([TrainingDayMoveDirection.Up, TrainingDayMoveDirection.Down])
});

const deleteTrainingDaySchema = trainingDayRefSchema;

const trainingDayExerciseSetSchema = z.object({
    reps: z
        .string()
        .trim()
        .max(50, 'Zapis powtórzeń jest zbyt długi.')
        .transform(value => value || null),
    durationSeconds: optionalNumber(
        z.coerce
            .number('Podaj czas pracy w sekundach.')
            .int('Czas pracy musi być liczbą całkowitą.')
            .min(1, 'Czas pracy musi wynosić co najmniej sekundę.')
            .max(86400, 'Czas pracy nie może przekraczać 24 godzin.')
    ),
    loadKg: optionalNumber(
        z.coerce
            .number('Podaj obciążenie w kilogramach.')
            .min(0, 'Obciążenie nie może być ujemne.')
            .max(1000, 'Obciążenie nie może przekraczać 1000 kg.')
    ),
    rir: z
        .string()
        .trim()
        .max(50, 'RIR jest zbyt długi.')
        .transform(value => value || null)
});

const trainingDayExercisePrescriptionSchema = z.object({
    targetType: z.enum([
        TrainingDayExerciseTargetType.Repetitions,
        TrainingDayExerciseTargetType.Duration
    ]),
    sets: z.array(trainingDayExerciseSetSchema).max(100, 'Ćwiczenie może mieć najwyżej 100 serii.'),
    tempo: z
        .string()
        .trim()
        .max(50, 'Tempo jest zbyt długie.')
        .transform(value => value || null),
    restSeconds: optionalNumber(
        z.coerce
            .number('Podaj czas przerwy w sekundach.')
            .int('Czas przerwy musi być liczbą całkowitą.')
            .min(0, 'Czas przerwy nie może być ujemny.')
            .max(3600, 'Czas przerwy nie może przekraczać godziny.')
    ),
    notes: z
        .string()
        .trim()
        .max(5000, 'Notatka jest zbyt długa.')
        .transform(value => value || null)
});

const addTrainingDayExerciseSchema = trainingDayExercisePrescriptionSchema
    .extend({
        ...trainingDayRefSchema.shape,
        exerciseId: z.uuid('Wybierz ćwiczenie z biblioteki.'),
        section: z.enum([TrainingDayExerciseSection.Warmup, TrainingDayExerciseSection.Main])
    })
    .superRefine(validateTrainingDayExerciseTarget);

const updateTrainingDayExerciseSchema = trainingDayExercisePrescriptionSchema
    .extend(trainingDayExerciseRefSchema.shape)
    .superRefine(validateTrainingDayExerciseTarget);

const moveTrainingDayExerciseSchema = trainingDayExerciseRefSchema.extend({
    direction: z.enum([TrainingDayExerciseMoveDirection.Up, TrainingDayExerciseMoveDirection.Down]),
    scope: z
        .enum([TrainingDayExerciseMoveScope.Exercise, TrainingDayExerciseMoveScope.Group])
        .default(TrainingDayExerciseMoveScope.Exercise)
});

const setTrainingDayExerciseLinkSchema = trainingDayExerciseRefSchema.extend({
    isLinkedToPrevious: z.enum(['true', 'false']).transform(value => value === 'true')
});

const deleteTrainingDayExerciseSchema = trainingDayExerciseRefSchema;

type TrainingDayRefFieldErrors = {
    trainingBlockId?: string[];
    trainingDayId?: string[];
};

type TrainingDayExerciseRefFieldErrors = TrainingDayRefFieldErrors & {
    trainingDayExerciseId?: string[];
};

export type TrainingBlockFieldErrors = {
    name?: string[];
    description?: string[];
    durationWeeks?: string[];
    startDate?: string[];
};

export type CreateTrainingBlockFieldErrors = TrainingBlockFieldErrors & {
    clientId?: string[];
};

export type UpdateTrainingBlockFieldErrors = TrainingBlockFieldErrors & {
    trainingBlockId?: string[];
};

export type TrainingDayFieldErrors = {
    name?: string[];
    description?: string[];
};

export type CreateTrainingDayFieldErrors = TrainingDayFieldErrors & {
    trainingBlockId?: string[];
};

export type UpdateTrainingDayFieldErrors = TrainingDayFieldErrors & TrainingDayRefFieldErrors;

export type MoveTrainingDayFieldErrors = TrainingDayRefFieldErrors & {
    direction?: string[];
};

export type DeleteTrainingDayFieldErrors = TrainingDayRefFieldErrors;

export type TrainingDayExerciseFieldErrors = {
    targetType?: string[];
    sets?: string[];
    tempo?: string[];
    restSeconds?: string[];
    notes?: string[];
};

export type AddTrainingDayExerciseFieldErrors = TrainingDayExerciseFieldErrors &
    TrainingDayRefFieldErrors & {
        exerciseId?: string[];
        section?: string[];
    };

export type UpdateTrainingDayExerciseFieldErrors = TrainingDayExerciseFieldErrors &
    TrainingDayExerciseRefFieldErrors;

export type MoveTrainingDayExerciseFieldErrors = TrainingDayExerciseRefFieldErrors & {
    direction?: string[];
    scope?: string[];
};

export type SetTrainingDayExerciseLinkFieldErrors = TrainingDayExerciseRefFieldErrors & {
    isLinkedToPrevious?: string[];
};

export type TrainingBlockSearchParams = {
    day?: string | string[];
    add?: string | string[];
};

export type DeleteTrainingDayExerciseFieldErrors = TrainingDayExerciseRefFieldErrors;

export function validateClientId({ clientId }: { clientId: string }) {
    const result = clientIdSchema.safeParse(clientId);

    if (!result.success) {
        return { ok: false as const };
    }

    return { ok: true as const, data: result.data };
}

export function validateTrainingBlockId({ trainingBlockId }: { trainingBlockId: string }) {
    const result = trainingBlockIdSchema.safeParse(trainingBlockId);

    if (!result.success) {
        return { ok: false as const };
    }

    return { ok: true as const, data: result.data };
}

export function validateCreateTrainingBlockForm(data: FormData) {
    const result = createTrainingBlockSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error)
                .fieldErrors satisfies CreateTrainingBlockFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateUpdateTrainingBlockForm(data: FormData) {
    const result = updateTrainingBlockSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error)
                .fieldErrors satisfies UpdateTrainingBlockFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateCreateTrainingDayForm(data: FormData) {
    const result = createTrainingDaySchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error)
                .fieldErrors satisfies CreateTrainingDayFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateUpdateTrainingDayForm(data: FormData) {
    const result = updateTrainingDaySchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error)
                .fieldErrors satisfies UpdateTrainingDayFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateMoveTrainingDayForm(data: FormData) {
    const result = moveTrainingDaySchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error)
                .fieldErrors satisfies MoveTrainingDayFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateDeleteTrainingDayForm(data: FormData) {
    const result = deleteTrainingDaySchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error)
                .fieldErrors satisfies DeleteTrainingDayFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateAddTrainingDayExerciseForm(data: FormData) {
    const result = addTrainingDayExerciseSchema.safeParse(readTrainingDayExerciseForm(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error)
                .fieldErrors satisfies AddTrainingDayExerciseFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateUpdateTrainingDayExerciseForm(data: FormData) {
    const result = updateTrainingDayExerciseSchema.safeParse(readTrainingDayExerciseForm(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error)
                .fieldErrors satisfies UpdateTrainingDayExerciseFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateMoveTrainingDayExerciseForm(data: FormData) {
    const result = moveTrainingDayExerciseSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error)
                .fieldErrors satisfies MoveTrainingDayExerciseFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateDeleteTrainingDayExerciseForm(data: FormData) {
    const result = deleteTrainingDayExerciseSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error)
                .fieldErrors satisfies DeleteTrainingDayExerciseFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateSetTrainingDayExerciseLinkForm(data: FormData) {
    const result = setTrainingDayExerciseLinkSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
        return {
            ok: false as const,
            fieldErrors: z.flattenError(result.error)
                .fieldErrors satisfies SetTrainingDayExerciseLinkFieldErrors
        };
    }

    return { ok: true as const, data: result.data };
}

export function validateTrainingBlockSearchParams(data: TrainingBlockSearchParams) {
    return trainingBlockSearchParamsSchema.parse({
        day: getFirstValue(data.day),
        add: getFirstValue(data.add)
    });
}
