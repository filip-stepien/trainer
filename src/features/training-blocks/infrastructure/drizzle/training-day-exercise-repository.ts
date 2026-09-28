import { and, asc, eq, inArray, isNull, sql } from 'drizzle-orm';

import { err, ok, type DrizzleDatabase } from '@/shared/server';

import type {
    DeleteTrainingDayExerciseByIdParams,
    FindAllTrainingDayExercisesParams,
    SaveTrainingDayExerciseParams,
    TrainingDayExerciseFilter,
    TrainingDayExerciseRepository,
    UpdateAllTrainingDayExercisesParams,
    UpdateTrainingDayExerciseByIdParams
} from '../../application/ports/training-day-exercise-repository';
import { TrainingBlockErrorCode } from '../../domain/errors';
import type {
    TrainingDayExercise,
    TrainingDayExerciseSection,
    TrainingDayExerciseTargetType
} from '../../domain/training-day-exercise';
import { trainingBlocksTable, trainingBlockVersionsTable } from './training-block-schema';
import { trainingDayExercisesTable } from './training-day-exercise-schema';
import { trainingDaysTable } from './training-day-schema';

const trainingDayExerciseSelection = {
    id: trainingDayExercisesTable.id,
    trainingDayId: trainingDayExercisesTable.trainingDayId,
    exerciseId: trainingDayExercisesTable.exerciseId,
    section: trainingDayExercisesTable.section,
    position: trainingDayExercisesTable.position,
    name: trainingDayExercisesTable.name,
    instructions: trainingDayExercisesTable.instructions,
    videoUrl: trainingDayExercisesTable.videoUrl,
    sets: trainingDayExercisesTable.sets,
    targetType: trainingDayExercisesTable.targetType,
    reps: trainingDayExercisesTable.reps,
    durationSeconds: trainingDayExercisesTable.durationSeconds,
    load: trainingDayExercisesTable.load,
    tempo: trainingDayExercisesTable.tempo,
    rir: trainingDayExercisesTable.rir,
    restSeconds: trainingDayExercisesTable.restSeconds,
    notes: trainingDayExercisesTable.notes,
    createdAt: trainingDayExercisesTable.createdAt,
    updatedAt: trainingDayExercisesTable.updatedAt
};

type TrainingDayExerciseRow = Omit<TrainingDayExercise, 'createdAt' | 'updatedAt'> & {
    createdAt: Date;
    updatedAt: Date;
};

function toTrainingDayExercise(row: TrainingDayExerciseRow): TrainingDayExercise {
    return {
        ...row,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
    };
}

function getDraftFilter({ coachId, trainingBlockId, trainingDayId }: TrainingDayExerciseFilter) {
    return and(
        eq(trainingBlocksTable.id, trainingBlockId),
        eq(trainingBlocksTable.coachId, coachId),
        isNull(trainingBlockVersionsTable.publishedAt),
        trainingDayId ? eq(trainingDaysTable.id, trainingDayId) : undefined
    );
}

function getMatchingIds(
    database: DrizzleDatabase,
    filter: TrainingDayExerciseFilter,
    trainingDayExerciseIds?: string[]
) {
    return database
        .select({ id: trainingDayExercisesTable.id })
        .from(trainingDayExercisesTable)
        .innerJoin(
            trainingDaysTable,
            eq(trainingDaysTable.id, trainingDayExercisesTable.trainingDayId)
        )
        .innerJoin(
            trainingBlockVersionsTable,
            eq(trainingBlockVersionsTable.id, trainingDaysTable.trainingBlockVersionId)
        )
        .innerJoin(
            trainingBlocksTable,
            eq(trainingBlocksTable.id, trainingBlockVersionsTable.trainingBlockId)
        )
        .where(
            and(
                getDraftFilter(filter),
                trainingDayExerciseIds
                    ? inArray(trainingDayExercisesTable.id, trainingDayExerciseIds)
                    : undefined
            )
        );
}

async function touchTrainingBlock(database: DrizzleDatabase, trainingBlockId: string) {
    await database
        .update(trainingBlocksTable)
        .set({ updatedAt: sql`now()` })
        .where(eq(trainingBlocksTable.id, trainingBlockId));
}

async function save(database: DrizzleDatabase, { data, filter }: SaveTrainingDayExerciseParams) {
    const rows = await database
        .insert(trainingDayExercisesTable)
        .select(
            database
                .select({
                    id: sql<string>`gen_random_uuid()`.as('id'),
                    trainingDayId: trainingDaysTable.id,
                    exerciseId: sql<string>`${data.exerciseId}`.as('exercise_id'),
                    section: sql<TrainingDayExerciseSection>`${data.section}`.as('section'),
                    position:
                        sql<number>`coalesce((select max(${trainingDayExercisesTable.position}) + 1 from ${trainingDayExercisesTable} where ${trainingDayExercisesTable.trainingDayId} = ${trainingDaysTable.id} and ${trainingDayExercisesTable.section} = ${data.section}), 0)`.as(
                            'position'
                        ),
                    name: sql<string>`${data.name}`.as('name'),
                    instructions: sql<string | null>`${data.instructions}`.as('instructions'),
                    videoUrl: sql<string | null>`${data.videoUrl}`.as('video_url'),
                    sets: sql<number | null>`${data.sets}`.as('sets'),
                    targetType: sql<TrainingDayExerciseTargetType>`${data.targetType}`.as(
                        'target_type'
                    ),
                    reps: sql<string | null>`${data.reps}`.as('reps'),
                    durationSeconds: sql<number | null>`${data.durationSeconds}`.as(
                        'duration_seconds'
                    ),
                    load: sql<string | null>`${data.load}`.as('load'),
                    tempo: sql<string | null>`${data.tempo}`.as('tempo'),
                    rir: sql<string | null>`${data.rir}`.as('rir'),
                    restSeconds: sql<number | null>`${data.restSeconds}`.as('rest_seconds'),
                    notes: sql<string | null>`${data.notes}`.as('notes'),
                    createdAt: sql<Date>`now()`.as('created_at'),
                    updatedAt: sql<Date>`now()`.as('updated_at')
                })
                .from(trainingDaysTable)
                .innerJoin(
                    trainingBlockVersionsTable,
                    eq(trainingBlockVersionsTable.id, trainingDaysTable.trainingBlockVersionId)
                )
                .innerJoin(
                    trainingBlocksTable,
                    eq(trainingBlocksTable.id, trainingBlockVersionsTable.trainingBlockId)
                )
                .where(getDraftFilter(filter))
        )
        .returning(trainingDayExerciseSelection);

    const row = rows[0];
    if (!row) {
        return err(TrainingBlockErrorCode.NotFound);
    }

    await touchTrainingBlock(database, filter.trainingBlockId);
    return ok(toTrainingDayExercise(row));
}

async function findAll(database: DrizzleDatabase, { filter }: FindAllTrainingDayExercisesParams) {
    const rows = await database
        .select(trainingDayExerciseSelection)
        .from(trainingDayExercisesTable)
        .innerJoin(
            trainingDaysTable,
            eq(trainingDaysTable.id, trainingDayExercisesTable.trainingDayId)
        )
        .innerJoin(
            trainingBlockVersionsTable,
            eq(trainingBlockVersionsTable.id, trainingDaysTable.trainingBlockVersionId)
        )
        .innerJoin(
            trainingBlocksTable,
            eq(trainingBlocksTable.id, trainingBlockVersionsTable.trainingBlockId)
        )
        .where(getDraftFilter(filter))
        .orderBy(
            asc(trainingDaysTable.position),
            asc(trainingDayExercisesTable.section),
            asc(trainingDayExercisesTable.position),
            asc(trainingDayExercisesTable.id)
        );

    return rows.map(toTrainingDayExercise);
}

async function updateById(
    database: DrizzleDatabase,
    { trainingDayExerciseId, data, filter }: UpdateTrainingDayExerciseByIdParams
) {
    const rows = await database
        .update(trainingDayExercisesTable)
        .set({ ...data, updatedAt: sql`now()` })
        .where(
            inArray(
                trainingDayExercisesTable.id,
                getMatchingIds(database, filter, [trainingDayExerciseId])
            )
        )
        .returning(trainingDayExerciseSelection);

    const row = rows[0];
    if (!row) {
        return err(TrainingBlockErrorCode.NotFound);
    }

    await touchTrainingBlock(database, filter.trainingBlockId);
    return ok(toTrainingDayExercise(row));
}

async function updateAll(
    database: DrizzleDatabase,
    { data, filter }: UpdateAllTrainingDayExercisesParams
) {
    if (!data.length) {
        return ok([]);
    }

    const ids = data.map(item => item.trainingDayExerciseId);
    const positionCases = data.map(
        item =>
            sql`when ${trainingDayExercisesTable.id} = ${item.trainingDayExerciseId} then ${item.position}`
    );
    const rows = await database
        .update(trainingDayExercisesTable)
        .set({
            position: sql<number>`case ${sql.join(positionCases, sql.raw(' '))} else ${trainingDayExercisesTable.position} end`,
            updatedAt: sql`now()`
        })
        .where(inArray(trainingDayExercisesTable.id, getMatchingIds(database, filter, ids)))
        .returning(trainingDayExerciseSelection);

    if (rows.length !== data.length) {
        return err(TrainingBlockErrorCode.NotFound);
    }

    await touchTrainingBlock(database, filter.trainingBlockId);
    return ok(
        rows.map(toTrainingDayExercise).sort((first, second) => first.position - second.position)
    );
}

async function deleteById(
    database: DrizzleDatabase,
    { trainingDayExerciseId, filter }: DeleteTrainingDayExerciseByIdParams
) {
    const rows = await database
        .delete(trainingDayExercisesTable)
        .where(
            inArray(
                trainingDayExercisesTable.id,
                getMatchingIds(database, filter, [trainingDayExerciseId])
            )
        )
        .returning({ id: trainingDayExercisesTable.id });

    if (!rows[0]) {
        return err(TrainingBlockErrorCode.NotFound);
    }

    await touchTrainingBlock(database, filter.trainingBlockId);
    return ok();
}

export function createDrizzleTrainingDayExerciseRepository({
    database
}: {
    database: DrizzleDatabase;
}): TrainingDayExerciseRepository {
    return {
        save: params => save(database, params),
        findAll: params => findAll(database, params),
        updateById: params => updateById(database, params),
        updateAll: params => updateAll(database, params),
        deleteById: params => deleteById(database, params)
    };
}
