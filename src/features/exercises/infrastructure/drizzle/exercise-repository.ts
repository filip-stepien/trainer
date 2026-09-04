import { and, asc, eq, inArray, isNotNull, isNull, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

import { err, ok, type DrizzleDatabase } from '@/shared/server';

import type {
    ExerciseRepository,
    FindAllExercisesParams,
    FindExerciseByIdParams,
    FindExercisePageParams,
    SaveExerciseParams,
    UpdateExerciseByIdParams,
    UpdateExerciseStatusByIdParams
} from '../../application/ports/exercise-repository';
import { ExerciseStatus, type Exercise } from '../../domain/exercise';
import { ExerciseErrorCode } from '../../domain/errors';
import { exercisesTable } from './exercise-schema';

const exerciseSelection = {
    id: exercisesTable.id,
    sourceExerciseId: exercisesTable.sourceExerciseId,
    isCustom: exercisesTable.isCustom,
    name: exercisesTable.name,
    instructions: exercisesTable.instructions,
    videoUrl: exercisesTable.videoUrl,
    archivedAt: exercisesTable.archivedAt,
    createdAt: exercisesTable.createdAt,
    updatedAt: exercisesTable.updatedAt
};

type ExerciseRow = {
    id: string;
    sourceExerciseId: string | null;
    isCustom: boolean;
    name: string;
    instructions: string | null;
    videoUrl: string | null;
    archivedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

function toExercise(row: ExerciseRow): Exercise {
    return {
        ...row,
        status: row.archivedAt ? ExerciseStatus.Archived : ExerciseStatus.Active,
        archivedAt: row.archivedAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
    };
}

function getCoachFilter(coachId: string | null | undefined) {
    if (coachId === undefined) {
        return undefined;
    }

    return coachId === null ? isNull(exercisesTable.coachId) : eq(exercisesTable.coachId, coachId);
}

function getStatusFilter(status: ExerciseStatus) {
    return status === ExerciseStatus.Archived
        ? isNotNull(exercisesTable.archivedAt)
        : isNull(exercisesTable.archivedAt);
}

function getNameFilter(name: string) {
    return sql`position(lower(${name}) in lower(${exercisesTable.name})) > 0`;
}

function getFilter(filter: FindAllExercisesParams['filter']) {
    return and(
        getCoachFilter(filter.coachId),
        filter.sourceExerciseIds
            ? filter.sourceExerciseIds.length
                ? inArray(exercisesTable.sourceExerciseId, filter.sourceExerciseIds)
                : sql`false`
            : undefined,
        filter.status ? getStatusFilter(filter.status) : undefined,
        filter.nameContains ? getNameFilter(filter.nameContains) : undefined
    );
}

async function save(database: DrizzleDatabase, { data }: SaveExerciseParams) {
    if (data.isCustom) {
        const rows = await database
            .insert(exercisesTable)
            .values(data)
            .returning(exerciseSelection);

        const row = rows[0];
        if (!row) {
            throw new Error('Exercise insert did not return a row.');
        }

        return ok(toExercise(row));
    }

    const sourceExercise = alias(exercisesTable, 'source_exercise');
    const rows = await database
        .insert(exercisesTable)
        .select(
            database
                .select({
                    id: sql<string>`gen_random_uuid()`.as('id'),
                    coachId: sql<string>`${data.coachId}`.as('coach_id'),
                    sourceExerciseId: sourceExercise.id,
                    isCustom: sql<boolean>`false`.as('is_custom'),
                    name: sourceExercise.name,
                    instructions: sourceExercise.instructions,
                    videoUrl: sourceExercise.videoUrl,
                    archivedAt: sql<Date | null>`null`.as('archived_at'),
                    createdAt: sql<Date>`now()`.as('created_at'),
                    updatedAt: sql<Date>`now()`.as('updated_at')
                })
                .from(sourceExercise)
                .where(
                    and(
                        eq(sourceExercise.id, data.sourceExerciseId),
                        isNull(sourceExercise.coachId),
                        isNull(sourceExercise.sourceExerciseId),
                        eq(sourceExercise.isCustom, false)
                    )
                )
        )
        .onConflictDoUpdate({
            target: [exercisesTable.coachId, exercisesTable.sourceExerciseId],
            targetWhere: sql`${exercisesTable.sourceExerciseId} is not null`,
            set: {
                archivedAt: null,
                updatedAt: sql`now()`
            }
        })
        .returning(exerciseSelection);

    const row = rows[0];
    if (!row) {
        return err(ExerciseErrorCode.SourceNotFound);
    }

    return ok(toExercise(row));
}

async function findAll(database: DrizzleDatabase, { filter }: FindAllExercisesParams) {
    const rows = await database
        .select(exerciseSelection)
        .from(exercisesTable)
        .where(getFilter(filter))
        .orderBy(asc(exercisesTable.name), asc(exercisesTable.id));

    return rows.map(toExercise);
}

async function findPage(database: DrizzleDatabase, { filter, pagination }: FindExercisePageParams) {
    const { limit, offset } = pagination;
    const rows = await database
        .select(exerciseSelection)
        .from(exercisesTable)
        .where(getFilter(filter))
        .orderBy(asc(exercisesTable.name), asc(exercisesTable.id))
        .limit(limit)
        .offset(offset);

    return rows.map(toExercise);
}

async function findById(database: DrizzleDatabase, { exerciseId, filter }: FindExerciseByIdParams) {
    const rows = await database
        .select(exerciseSelection)
        .from(exercisesTable)
        .where(and(eq(exercisesTable.id, exerciseId), getCoachFilter(filter.coachId)))
        .limit(1);

    return rows[0] ? toExercise(rows[0]) : null;
}

async function updateById(
    database: DrizzleDatabase,
    { exerciseId, data, filter }: UpdateExerciseByIdParams
) {
    const rows = await database
        .update(exercisesTable)
        .set({ ...data, updatedAt: sql`now()` })
        .where(and(eq(exercisesTable.id, exerciseId), eq(exercisesTable.coachId, filter.coachId)))
        .returning(exerciseSelection);

    return rows[0] ? ok(toExercise(rows[0])) : err(ExerciseErrorCode.NotFound);
}

async function updateStatusById(
    database: DrizzleDatabase,
    { exerciseId, filter, status }: UpdateExerciseStatusByIdParams
) {
    const rows = await database
        .update(exercisesTable)
        .set({
            archivedAt: status === ExerciseStatus.Archived ? sql`now()` : null,
            updatedAt: sql`now()`
        })
        .where(and(eq(exercisesTable.id, exerciseId), eq(exercisesTable.coachId, filter.coachId)))
        .returning(exerciseSelection);

    return rows[0] ? ok(toExercise(rows[0])) : err(ExerciseErrorCode.NotFound);
}

export function createDrizzleExerciseRepository({
    database
}: {
    database: DrizzleDatabase;
}): ExerciseRepository {
    return {
        save: params => save(database, params),
        findAll: params => findAll(database, params),
        findPage: params => findPage(database, params),
        findById: params => findById(database, params),
        updateById: params => updateById(database, params),
        updateStatusById: params => updateStatusById(database, params)
    };
}
