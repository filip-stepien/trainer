import { sql } from 'drizzle-orm';
import {
    check,
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar
} from 'drizzle-orm/pg-core';

import { exercisesTable } from '@/features/exercises/infrastructure/drizzle/exercise-schema';

import {
    TrainingDayExerciseSection,
    TrainingDayExerciseTargetType
} from '../../domain/training-day-exercise';
import { trainingDaysTable } from './training-day-schema';

export const trainingDayExerciseSectionEnum = pgEnum('training_day_exercise_section', [
    TrainingDayExerciseSection.Warmup,
    TrainingDayExerciseSection.Main
]);

export const trainingDayExerciseTargetTypeEnum = pgEnum('training_day_exercise_target_type', [
    TrainingDayExerciseTargetType.Repetitions,
    TrainingDayExerciseTargetType.Duration
]);

export const trainingDayExercisesTable = pgTable(
    'training_day_exercises',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        trainingDayId: uuid('training_day_id')
            .notNull()
            .references(() => trainingDaysTable.id, { onDelete: 'cascade' }),
        exerciseId: uuid('exercise_id')
            .notNull()
            .references(() => exercisesTable.id, { onDelete: 'restrict' }),
        section: trainingDayExerciseSectionEnum('section').notNull(),
        position: integer('position').notNull(),
        name: varchar('name', { length: 150 }).notNull(),
        instructions: text('instructions'),
        videoUrl: text('video_url'),
        sets: integer('sets'),
        targetType: trainingDayExerciseTargetTypeEnum('target_type')
            .notNull()
            .default(TrainingDayExerciseTargetType.Repetitions),
        reps: varchar('reps', { length: 50 }),
        durationSeconds: integer('duration_seconds'),
        load: varchar('load', { length: 50 }),
        tempo: varchar('tempo', { length: 50 }),
        rir: varchar('rir', { length: 50 }),
        restSeconds: integer('rest_seconds'),
        notes: text('notes'),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
    },
    table => [
        index('training_day_exercises_day_section_position_index').on(
            table.trainingDayId,
            table.section,
            table.position,
            table.id
        ),
        check('training_day_exercises_position_check', sql`${table.position} >= 0`),
        check(
            'training_day_exercises_sets_check',
            sql`${table.sets} is null or (${table.sets} >= 1 and ${table.sets} <= 100)`
        ),
        check(
            'training_day_exercises_rest_seconds_check',
            sql`${table.restSeconds} is null or (${table.restSeconds} >= 0 and ${table.restSeconds} <= 3600)`
        ),
        check(
            'training_day_exercises_duration_seconds_check',
            sql`${table.durationSeconds} is null or (${table.durationSeconds} >= 1 and ${table.durationSeconds} <= 86400)`
        ),
        check(
            'training_day_exercises_target_check',
            sql`(${table.targetType} = 'repetitions' and ${table.durationSeconds} is null) or (${table.targetType} = 'duration' and ${table.reps} is null and ${table.durationSeconds} is not null)`
        )
    ]
);
