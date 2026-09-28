import { and, asc, eq, inArray, isNull, sql } from 'drizzle-orm';

import { err, ok, type DrizzleDatabase } from '@/shared/server';

import type {
    DeleteTrainingDayByIdParams,
    FindAllTrainingDaysParams,
    SaveTrainingDayParams,
    TrainingDayFilter,
    TrainingDayRepository,
    UpdateAllTrainingDaysParams,
    UpdateTrainingDayByIdParams
} from '../../application/ports/training-day-repository';
import type { TrainingDay } from '../../domain/training-day';
import { TrainingBlockErrorCode } from '../../domain/errors';
import { trainingBlocksTable, trainingBlockVersionsTable } from './training-block-schema';
import { trainingDaysTable } from './training-day-schema';

const trainingDaySelection = {
    id: trainingDaysTable.id,
    trainingBlockVersionId: trainingDaysTable.trainingBlockVersionId,
    position: trainingDaysTable.position,
    name: trainingDaysTable.name,
    description: trainingDaysTable.description,
    createdAt: trainingDaysTable.createdAt,
    updatedAt: trainingDaysTable.updatedAt
};

type TrainingDayRow = Omit<TrainingDay, 'createdAt' | 'updatedAt'> & {
    createdAt: Date;
    updatedAt: Date;
};

function toTrainingDay(row: TrainingDayRow): TrainingDay {
    return {
        ...row,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
    };
}

function getDraftFilter({ coachId, trainingBlockId }: TrainingDayFilter) {
    return and(
        eq(trainingBlocksTable.id, trainingBlockId),
        eq(trainingBlocksTable.coachId, coachId),
        isNull(trainingBlockVersionsTable.publishedAt)
    );
}

function getMatchingDayIds(
    database: DrizzleDatabase,
    filter: TrainingDayFilter,
    trainingDayIds?: string[]
) {
    return database
        .select({ id: trainingDaysTable.id })
        .from(trainingDaysTable)
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
                trainingDayIds ? inArray(trainingDaysTable.id, trainingDayIds) : undefined
            )
        );
}

async function touchTrainingBlock(database: DrizzleDatabase, trainingBlockId: string) {
    await database
        .update(trainingBlocksTable)
        .set({ updatedAt: sql`now()` })
        .where(eq(trainingBlocksTable.id, trainingBlockId));
}

async function save(database: DrizzleDatabase, { data, filter }: SaveTrainingDayParams) {
    const rows = await database
        .insert(trainingDaysTable)
        .select(
            database
                .select({
                    id: sql<string>`gen_random_uuid()`.as('id'),
                    trainingBlockVersionId: trainingBlockVersionsTable.id,
                    position:
                        sql<number>`coalesce((select max(${trainingDaysTable.position}) + 1 from ${trainingDaysTable} where ${trainingDaysTable.trainingBlockVersionId} = ${trainingBlockVersionsTable.id}), 0)`.as(
                            'position'
                        ),
                    name: sql<string>`${data.name}`.as('name'),
                    description: sql<string | null>`${data.description}`.as('description'),
                    createdAt: sql<Date>`now()`.as('created_at'),
                    updatedAt: sql<Date>`now()`.as('updated_at')
                })
                .from(trainingBlockVersionsTable)
                .innerJoin(
                    trainingBlocksTable,
                    eq(trainingBlocksTable.id, trainingBlockVersionsTable.trainingBlockId)
                )
                .where(getDraftFilter(filter))
        )
        .returning(trainingDaySelection);

    const row = rows[0];
    if (!row) {
        return err(TrainingBlockErrorCode.NotFound);
    }

    await touchTrainingBlock(database, filter.trainingBlockId);
    return ok(toTrainingDay(row));
}

async function findAll(database: DrizzleDatabase, { filter }: FindAllTrainingDaysParams) {
    const rows = await database
        .select(trainingDaySelection)
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
        .orderBy(asc(trainingDaysTable.position), asc(trainingDaysTable.id));

    return rows.map(toTrainingDay);
}

async function updateById(
    database: DrizzleDatabase,
    { trainingDayId, data, filter }: UpdateTrainingDayByIdParams
) {
    const rows = await database
        .update(trainingDaysTable)
        .set({ ...data, updatedAt: sql`now()` })
        .where(inArray(trainingDaysTable.id, getMatchingDayIds(database, filter, [trainingDayId])))
        .returning(trainingDaySelection);

    const row = rows[0];
    if (!row) {
        return err(TrainingBlockErrorCode.NotFound);
    }

    await touchTrainingBlock(database, filter.trainingBlockId);
    return ok(toTrainingDay(row));
}

async function updateAll(database: DrizzleDatabase, { data, filter }: UpdateAllTrainingDaysParams) {
    if (!data.length) {
        return ok([]);
    }

    const trainingDayIds = data.map(item => item.trainingDayId);
    const positionCases = data.map(
        item => sql`when ${trainingDaysTable.id} = ${item.trainingDayId} then ${item.position}`
    );
    const rows = await database
        .update(trainingDaysTable)
        .set({
            position: sql<number>`case ${sql.join(positionCases, sql.raw(' '))} else ${trainingDaysTable.position} end`,
            updatedAt: sql`now()`
        })
        .where(inArray(trainingDaysTable.id, getMatchingDayIds(database, filter, trainingDayIds)))
        .returning(trainingDaySelection);

    if (rows.length !== data.length) {
        return err(TrainingBlockErrorCode.NotFound);
    }

    await touchTrainingBlock(database, filter.trainingBlockId);
    return ok(rows.map(toTrainingDay).sort((first, second) => first.position - second.position));
}

async function deleteById(
    database: DrizzleDatabase,
    { trainingDayId, filter }: DeleteTrainingDayByIdParams
) {
    const rows = await database
        .delete(trainingDaysTable)
        .where(inArray(trainingDaysTable.id, getMatchingDayIds(database, filter, [trainingDayId])))
        .returning({ id: trainingDaysTable.id });

    if (!rows[0]) {
        return err(TrainingBlockErrorCode.NotFound);
    }

    await touchTrainingBlock(database, filter.trainingBlockId);
    return ok();
}

export function createDrizzleTrainingDayRepository({
    database
}: {
    database: DrizzleDatabase;
}): TrainingDayRepository {
    return {
        save: params => save(database, params),
        findAll: params => findAll(database, params),
        updateById: params => updateById(database, params),
        updateAll: params => updateAll(database, params),
        deleteById: params => deleteById(database, params)
    };
}
