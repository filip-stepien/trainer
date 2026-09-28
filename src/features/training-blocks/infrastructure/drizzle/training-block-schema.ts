import { sql } from 'drizzle-orm';
import {
    check,
    date,
    foreignKey,
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
    type AnyPgColumn
} from 'drizzle-orm/pg-core';

import { coachClientsTable } from '@/features/clients/infrastructure/drizzle/client-schema';

import { TrainingBlockStatus } from '../../domain/training-block';

export const trainingBlockCoachClientForeignKey = 'training_blocks_coach_client_foreign_key';

export const trainingBlockStatusEnum = pgEnum('training_block_status', [
    TrainingBlockStatus.Draft,
    TrainingBlockStatus.Active,
    TrainingBlockStatus.Completed
]);

export const trainingBlocksTable = pgTable(
    'training_blocks',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        coachId: text('coach_id').notNull(),
        clientId: uuid('client_id').notNull(),
        status: trainingBlockStatusEnum('status').notNull().default(TrainingBlockStatus.Draft),
        startDate: date('start_date')
            .notNull()
            .default(sql`current_date`),
        activeVersionId: uuid('active_version_id').references(
            (): AnyPgColumn => trainingBlockVersionsTable.id,
            { onDelete: 'restrict' }
        ),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
    },
    table => [
        foreignKey({
            name: trainingBlockCoachClientForeignKey,
            columns: [table.coachId, table.clientId],
            foreignColumns: [coachClientsTable.coachId, coachClientsTable.clientId]
        }).onDelete('cascade'),
        uniqueIndex('training_blocks_active_coach_client_unique')
            .on(table.coachId, table.clientId)
            .where(sql`${table.status} = 'active'`),
        index('training_blocks_coach_client_updated_index').on(
            table.coachId,
            table.clientId,
            table.updatedAt
        ),
        check(
            'training_blocks_active_version_check',
            sql`${table.status} <> 'active' or ${table.activeVersionId} is not null`
        )
    ]
);

export const trainingBlockVersionsTable = pgTable(
    'training_block_versions',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        trainingBlockId: uuid('training_block_id')
            .notNull()
            .references(() => trainingBlocksTable.id, { onDelete: 'cascade' }),
        versionNumber: integer('version_number'),
        name: varchar('name', { length: 150 }).notNull(),
        description: text('description'),
        durationWeeks: integer('duration_weeks'),
        publishedAt: timestamp('published_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
    },
    table => [
        uniqueIndex('training_block_versions_number_unique')
            .on(table.trainingBlockId, table.versionNumber)
            .where(sql`${table.versionNumber} is not null`),
        uniqueIndex('training_block_versions_draft_unique')
            .on(table.trainingBlockId)
            .where(sql`${table.publishedAt} is null`),
        index('training_block_versions_block_published_index').on(
            table.trainingBlockId,
            table.publishedAt
        ),
        check(
            'training_block_versions_publication_check',
            sql`(${table.publishedAt} is null and ${table.versionNumber} is null) or (${table.publishedAt} is not null and ${table.versionNumber} is not null)`
        ),
        check(
            'training_block_versions_duration_weeks_check',
            sql`${table.durationWeeks} is null or (${table.durationWeeks} >= 1 and ${table.durationWeeks} <= 104)`
        )
    ]
);
