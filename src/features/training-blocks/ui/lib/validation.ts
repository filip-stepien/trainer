import 'server-only';

import { z } from 'zod';

import { TrainingDayMoveDirection } from '../../domain/training-day';
import {
    TrainingDayExerciseMoveDirection,
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
    if (
        data.targetType === TrainingDayExerciseTargetType.Duration &&
        data.durationSeconds === null
    ) {
        context.addIssue({
            code: 'custom',
            path: ['durationSeconds'],
            message: 'Podaj czas pracy.'
        });
    }
}

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
    clientId: z.uuid('Nieprawidłowy identyfikator podopiecznego.')
});

const updateTrainingBlockSchema = trainingBlockSchema.extend({
    trainingBlockId: z.uuid('Nieprawidłowy identyfikator bloku treningowego.')
});

const trainingBlockIdSchema = z.uuid();

const clientIdSchema = z.uuid();

const trainingDaySchema = z.object({
    name: z.string().trim().min(1, 'Podaj nazwę dnia.').max(150, 'Nazwa jest zbyt długa.'),
    description: z
        .string()
        .trim()
        .max(5000, 'Opis jest zbyt długi.')
        .transform(value => value || null)
});

const createTrainingDaySchema = trainingDaySchema.extend({
    trainingBlockId: z.uuid('Nieprawidłowy identyfikator bloku treningowego.')
});

const updateTrainingDaySchema = createTrainingDaySchema.extend({
    trainingDayId: z.uuid('Nieprawidłowy identyfikator dnia treningowego.')
});

const moveTrainingDaySchema = z.object({
    trainingBlockId: z.uuid('Nieprawidłowy identyfikator bloku treningowego.'),
    trainingDayId: z.uuid('Nieprawidłowy identyfikator dnia treningowego.'),
    direction: z.enum([TrainingDayMoveDirection.Up, TrainingDayMoveDirection.Down])
});

const deleteTrainingDaySchema = z.object({
    trainingBlockId: z.uuid('Nieprawidłowy identyfikator bloku treningowego.'),
    trainingDayId: z.uuid('Nieprawidłowy identyfikator dnia treningowego.')
});

const trainingDayExercisePrescriptionSchema = z.object({
    sets: optionalNumber(
        z.coerce
            .number('Podaj liczbę serii.')
            .int('Liczba serii musi być liczbą całkowitą.')
            .min(1, 'Podaj co najmniej jedną serię.')
            .max(100, 'Liczba serii nie może przekraczać 100.')
    ),
    targetType: z.enum([
        TrainingDayExerciseTargetType.Repetitions,
        TrainingDayExerciseTargetType.Duration
    ]),
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
    load: z
        .string()
        .trim()
        .max(50, 'Opis obciążenia jest zbyt długi.')
        .transform(value => value || null),
    tempo: z
        .string()
        .trim()
        .max(50, 'Tempo jest zbyt długie.')
        .transform(value => value || null),
    rir: z
        .string()
        .trim()
        .max(50, 'RIR jest zbyt długi.')
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
        trainingBlockId: z.uuid('Nieprawidłowy identyfikator bloku treningowego.'),
        trainingDayId: z.uuid('Nieprawidłowy identyfikator dnia treningowego.'),
        exerciseId: z.uuid('Wybierz ćwiczenie z biblioteki.'),
        section: z.enum([TrainingDayExerciseSection.Warmup, TrainingDayExerciseSection.Main])
    })
    .superRefine(validateTrainingDayExerciseTarget);

const updateTrainingDayExerciseSchema = trainingDayExercisePrescriptionSchema
    .extend({
        trainingBlockId: z.uuid('Nieprawidłowy identyfikator bloku treningowego.'),
        trainingDayId: z.uuid('Nieprawidłowy identyfikator dnia treningowego.'),
        trainingDayExerciseId: z.uuid('Nieprawidłowy identyfikator ćwiczenia w planie.')
    })
    .superRefine(validateTrainingDayExerciseTarget);

const moveTrainingDayExerciseSchema = z.object({
    trainingBlockId: z.uuid('Nieprawidłowy identyfikator bloku treningowego.'),
    trainingDayId: z.uuid('Nieprawidłowy identyfikator dnia treningowego.'),
    trainingDayExerciseId: z.uuid('Nieprawidłowy identyfikator ćwiczenia w planie.'),
    direction: z.enum([TrainingDayExerciseMoveDirection.Up, TrainingDayExerciseMoveDirection.Down])
});

const deleteTrainingDayExerciseSchema = z.object({
    trainingBlockId: z.uuid('Nieprawidłowy identyfikator bloku treningowego.'),
    trainingDayId: z.uuid('Nieprawidłowy identyfikator dnia treningowego.'),
    trainingDayExerciseId: z.uuid('Nieprawidłowy identyfikator ćwiczenia w planie.')
});

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

export type UpdateTrainingDayFieldErrors = CreateTrainingDayFieldErrors & {
    trainingDayId?: string[];
};

export type MoveTrainingDayFieldErrors = {
    trainingBlockId?: string[];
    trainingDayId?: string[];
    direction?: string[];
};

export type DeleteTrainingDayFieldErrors = {
    trainingBlockId?: string[];
    trainingDayId?: string[];
};

export type TrainingDayExerciseFieldErrors = {
    sets?: string[];
    targetType?: string[];
    reps?: string[];
    durationSeconds?: string[];
    load?: string[];
    tempo?: string[];
    rir?: string[];
    restSeconds?: string[];
    notes?: string[];
};

export type AddTrainingDayExerciseFieldErrors = TrainingDayExerciseFieldErrors & {
    trainingBlockId?: string[];
    trainingDayId?: string[];
    exerciseId?: string[];
    section?: string[];
};

export type UpdateTrainingDayExerciseFieldErrors = TrainingDayExerciseFieldErrors & {
    trainingBlockId?: string[];
    trainingDayId?: string[];
    trainingDayExerciseId?: string[];
};

export type MoveTrainingDayExerciseFieldErrors = {
    trainingBlockId?: string[];
    trainingDayId?: string[];
    trainingDayExerciseId?: string[];
    direction?: string[];
};

export type DeleteTrainingDayExerciseFieldErrors = {
    trainingBlockId?: string[];
    trainingDayId?: string[];
    trainingDayExerciseId?: string[];
};

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
    const result = addTrainingDayExerciseSchema.safeParse(Object.fromEntries(data));

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
    const result = updateTrainingDayExerciseSchema.safeParse(Object.fromEntries(data));

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
