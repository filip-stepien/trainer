import { sql } from 'drizzle-orm';
import {
    check,
    index,
    integer,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar
} from 'drizzle-orm/pg-core';

import { trainingBlockVersionsTable } from './training-block-schema';

export const trainingDaysTable = pgTable(
    'training_days',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        trainingBlockVersionId: uuid('training_block_version_id')
            .notNull()
            .references(() => trainingBlockVersionsTable.id, { onDelete: 'cascade' }),
        position: integer('position').notNull(),
        name: varchar('name', { length: 150 }).notNull(),
        description: text('description'),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
    },
    table => [
        index('training_days_version_position_index').on(
            table.trainingBlockVersionId,
            table.position,
            table.id
        ),
        check('training_days_position_check', sql`${table.position} >= 0`)
    ]
);
