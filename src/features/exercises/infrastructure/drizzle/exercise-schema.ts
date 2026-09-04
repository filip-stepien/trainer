import { sql } from 'drizzle-orm';
import {
    boolean,
    check,
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
    type AnyPgColumn
} from 'drizzle-orm/pg-core';

export const exercisesTable = pgTable(
    'exercises',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        coachId: text('coach_id'),
        sourceExerciseId: uuid('source_exercise_id').references(
            (): AnyPgColumn => exercisesTable.id,
            { onDelete: 'restrict' }
        ),
        isCustom: boolean('is_custom').notNull().default(true),
        name: varchar('name', { length: 150 }).notNull(),
        instructions: text('instructions'),
        videoUrl: text('video_url'),
        archivedAt: timestamp('archived_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
    },
    table => [
        index('exercises_coach_archived_name_index').on(
            table.coachId,
            table.archivedAt,
            table.name
        ),
        uniqueIndex('exercises_coach_source_unique_index')
            .on(table.coachId, table.sourceExerciseId)
            .where(sql`${table.sourceExerciseId} is not null`),
        check(
            'exercises_kind_check',
            sql`(
                ${table.coachId} is null
                and ${table.sourceExerciseId} is null
                and not ${table.isCustom}
            ) or (
                ${table.coachId} is not null
                and ${table.sourceExerciseId} is not null
                and not ${table.isCustom}
            ) or (
                ${table.coachId} is not null
                and ${table.sourceExerciseId} is null
                and ${table.isCustom}
            )`
        )
    ]
);
