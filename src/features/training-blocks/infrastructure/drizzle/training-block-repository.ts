import { and, desc, eq, inArray, isNull, sql } from 'drizzle-orm';

import { err, isDrizzleError, ok, type DrizzleDatabase } from '@/shared/server';

import type {
    FindAllTrainingBlocksParams,
    FindTrainingBlockByIdParams,
    SaveTrainingBlockParams,
    TrainingBlockRepository,
    UpdateTrainingBlockByIdParams
} from '../../application/ports/training-block-repository';
import { TrainingBlockStatus, type TrainingBlock } from '../../domain/training-block';
import { TrainingBlockErrorCode } from '../../domain/errors';
import {
    trainingBlockCoachClientForeignKey,
    trainingBlocksTable,
    trainingBlockVersionsTable
} from './training-block-schema';

const trainingBlockSelection = {
    id: trainingBlocksTable.id,
    clientId: trainingBlocksTable.clientId,
    status: trainingBlocksTable.status,
    startDate: trainingBlocksTable.startDate,
    activeVersionId: trainingBlocksTable.activeVersionId,
    createdAt: trainingBlocksTable.createdAt,
    updatedAt: trainingBlocksTable.updatedAt,
    versionId: trainingBlockVersionsTable.id,
    versionNumber: trainingBlockVersionsTable.versionNumber,
    name: trainingBlockVersionsTable.name,
    description: trainingBlockVersionsTable.description,
    durationWeeks: trainingBlockVersionsTable.durationWeeks,
    publishedAt: trainingBlockVersionsTable.publishedAt,
    versionCreatedAt: trainingBlockVersionsTable.createdAt,
    versionUpdatedAt: trainingBlockVersionsTable.updatedAt
};

type TrainingBlockRow = {
    id: string;
    clientId: string;
    status: TrainingBlockStatus;
    startDate: string;
    activeVersionId: string | null;
    createdAt: Date;
    updatedAt: Date;
    versionId: string | null;
    versionNumber: number | null;
    name: string | null;
    description: string | null;
    durationWeeks: number | null;
    publishedAt: Date | null;
    versionCreatedAt: Date | null;
    versionUpdatedAt: Date | null;
};

function toTrainingBlock(row: TrainingBlockRow): TrainingBlock {
    const draftVersion =
        row.versionId && row.name && row.versionCreatedAt && row.versionUpdatedAt
            ? {
                  id: row.versionId,
                  versionNumber: row.versionNumber,
                  name: row.name,
                  description: row.description,
                  durationWeeks: row.durationWeeks,
                  publishedAt: row.publishedAt?.toISOString() ?? null,
                  createdAt: row.versionCreatedAt.toISOString(),
                  updatedAt: row.versionUpdatedAt.toISOString()
              }
            : null;

    return {
        id: row.id,
        clientId: row.clientId,
        status: row.status,
        startDate: row.startDate,
        activeVersionId: row.activeVersionId,
        draftVersion,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
    };
}

function getFilter({ coachId, clientId }: FindAllTrainingBlocksParams['filter']) {
    return and(
        eq(trainingBlocksTable.coachId, coachId),
        clientId ? eq(trainingBlocksTable.clientId, clientId) : undefined
    );
}

function isClientNotFound(error: unknown): boolean {
    return isDrizzleError(error) && error.cause.constraint === trainingBlockCoachClientForeignKey;
}

async function save(
    database: DrizzleDatabase,
    { coachId, clientId, data }: SaveTrainingBlockParams
) {
    try {
        const createdTrainingBlock = database.$with('created_training_block').as(
            database
                .insert(trainingBlocksTable)
                .values({ coachId, clientId, startDate: data.startDate })
                .returning({
                    id: trainingBlocksTable.id,
                    clientId: trainingBlocksTable.clientId,
                    status: trainingBlocksTable.status,
                    startDate: trainingBlocksTable.startDate,
                    activeVersionId: trainingBlocksTable.activeVersionId,
                    createdAt: trainingBlocksTable.createdAt,
                    updatedAt: trainingBlocksTable.updatedAt
                })
        );
        const createdVersion = database.$with('created_training_block_version').as(
            database
                .insert(trainingBlockVersionsTable)
                .values({
                    trainingBlockId: sql`(select ${createdTrainingBlock.id} from ${createdTrainingBlock})`,
                    name: data.name,
                    description: data.description,
                    durationWeeks: data.durationWeeks
                })
                .returning({
                    id: trainingBlockVersionsTable.id,
                    trainingBlockId: trainingBlockVersionsTable.trainingBlockId,
                    versionNumber: trainingBlockVersionsTable.versionNumber,
                    name: trainingBlockVersionsTable.name,
                    description: trainingBlockVersionsTable.description,
                    durationWeeks: trainingBlockVersionsTable.durationWeeks,
                    publishedAt: trainingBlockVersionsTable.publishedAt,
                    createdAt: trainingBlockVersionsTable.createdAt,
                    updatedAt: trainingBlockVersionsTable.updatedAt
                })
        );
        const rows = await database
            .with(createdTrainingBlock, createdVersion)
            .select({
                id: createdTrainingBlock.id,
                clientId: createdTrainingBlock.clientId,
                status: createdTrainingBlock.status,
                startDate: createdTrainingBlock.startDate,
                activeVersionId: createdTrainingBlock.activeVersionId,
                createdAt: createdTrainingBlock.createdAt,
                updatedAt: createdTrainingBlock.updatedAt,
                versionId: createdVersion.id,
                versionNumber: createdVersion.versionNumber,
                name: createdVersion.name,
                description: createdVersion.description,
                durationWeeks: createdVersion.durationWeeks,
                publishedAt: createdVersion.publishedAt,
                versionCreatedAt: createdVersion.createdAt,
                versionUpdatedAt: createdVersion.updatedAt
            })
            .from(createdTrainingBlock)
            .innerJoin(createdVersion, eq(createdVersion.trainingBlockId, createdTrainingBlock.id));

        const row = rows[0];
        if (!row) {
            throw new Error('Training block insert did not return a row.');
        }

        return ok(toTrainingBlock(row));
    } catch (error) {
        if (isClientNotFound(error)) {
            return err(TrainingBlockErrorCode.ClientNotFound);
        }
        throw error;
    }
}

async function findAll(database: DrizzleDatabase, { filter }: FindAllTrainingBlocksParams) {
    const rows = await database
        .select(trainingBlockSelection)
        .from(trainingBlocksTable)
        .leftJoin(
            trainingBlockVersionsTable,
            and(
                eq(trainingBlockVersionsTable.trainingBlockId, trainingBlocksTable.id),
                isNull(trainingBlockVersionsTable.publishedAt)
            )
        )
        .where(getFilter(filter))
        .orderBy(desc(trainingBlocksTable.updatedAt), desc(trainingBlocksTable.id));

    return rows.map(toTrainingBlock);
}

async function findById(
    database: DrizzleDatabase,
    { trainingBlockId, filter }: FindTrainingBlockByIdParams
) {
    const rows = await database
        .select(trainingBlockSelection)
        .from(trainingBlocksTable)
        .leftJoin(
            trainingBlockVersionsTable,
            and(
                eq(trainingBlockVersionsTable.trainingBlockId, trainingBlocksTable.id),
                isNull(trainingBlockVersionsTable.publishedAt)
            )
        )
        .where(and(eq(trainingBlocksTable.id, trainingBlockId), getFilter(filter)))
        .limit(1);

    return rows[0] ? toTrainingBlock(rows[0]) : null;
}

async function updateById(
    database: DrizzleDatabase,
    { trainingBlockId, data, filter }: UpdateTrainingBlockByIdParams
) {
    const matchingDraft = database
        .select({ id: trainingBlockVersionsTable.id })
        .from(trainingBlockVersionsTable)
        .innerJoin(
            trainingBlocksTable,
            eq(trainingBlocksTable.id, trainingBlockVersionsTable.trainingBlockId)
        )
        .where(
            and(
                eq(trainingBlocksTable.id, trainingBlockId),
                getFilter(filter),
                isNull(trainingBlockVersionsTable.publishedAt)
            )
        );
    const updatedVersion = database.$with('updated_training_block_version').as(
        database
            .update(trainingBlockVersionsTable)
            .set({
                name: data.name,
                description: data.description,
                durationWeeks: data.durationWeeks,
                updatedAt: sql`now()`
            })
            .where(inArray(trainingBlockVersionsTable.id, matchingDraft))
            .returning({ trainingBlockId: trainingBlockVersionsTable.trainingBlockId })
    );
    const rows = await database
        .with(updatedVersion)
        .update(trainingBlocksTable)
        .set({ startDate: data.startDate, updatedAt: sql`now()` })
        .where(
            and(
                eq(trainingBlocksTable.id, trainingBlockId),
                inArray(
                    trainingBlocksTable.id,
                    database.select({ id: updatedVersion.trainingBlockId }).from(updatedVersion)
                )
            )
        )
        .returning({ id: trainingBlocksTable.id });

    if (!rows[0]) {
        return err(TrainingBlockErrorCode.NotFound);
    }

    const trainingBlock = await findById(database, { trainingBlockId, filter });
    if (!trainingBlock) {
        throw new Error('Updated training block could not be read.');
    }

    return ok(trainingBlock);
}

export function createDrizzleTrainingBlockRepository({
    database
}: {
    database: DrizzleDatabase;
}): TrainingBlockRepository {
    return {
        save: params => save(database, params),
        findAll: params => findAll(database, params),
        findById: params => findById(database, params),
        updateById: params => updateById(database, params)
    };
}
