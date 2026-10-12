ALTER TABLE "training_day_exercises" DROP CONSTRAINT "training_day_exercises_duration_seconds_check";--> statement-breakpoint
ALTER TABLE "training_day_exercises" DROP CONSTRAINT "training_day_exercises_target_check";--> statement-breakpoint
ALTER TABLE "training_day_exercises" DROP CONSTRAINT "training_day_exercises_sets_check";--> statement-breakpoint
ALTER TABLE "training_day_exercises" ADD COLUMN "set_rows" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
UPDATE "training_day_exercises" AS "exercise"
SET "set_rows" = coalesce(
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'reps', "exercise"."reps",
                'durationSeconds', "exercise"."duration_seconds",
                'loadKg',
                CASE
                    WHEN "exercise"."load" ~* '^\s*\d+([.,]\d+)?\s*(kg)?\s*$'
                    THEN replace(
                        substring("exercise"."load" from '\d+(?:[.,]\d+)?'),
                        ',',
                        '.'
                    )::numeric
                    ELSE NULL
                END,
                'rir', "exercise"."rir"
            )
            ORDER BY "set_number"
        )
        FROM generate_series(
            1,
            greatest(
                coalesce("exercise"."sets", 0),
                CASE
                    WHEN "exercise"."reps" IS NOT NULL
                        OR "exercise"."duration_seconds" IS NOT NULL
                        OR "exercise"."load" IS NOT NULL
                        OR "exercise"."rir" IS NOT NULL
                    THEN 1
                    ELSE 0
                END
            )
        ) AS "set_number"
    ),
    '[]'::jsonb
);--> statement-breakpoint
ALTER TABLE "training_day_exercises" DROP COLUMN "sets";--> statement-breakpoint
ALTER TABLE "training_day_exercises" DROP COLUMN "reps";--> statement-breakpoint
ALTER TABLE "training_day_exercises" DROP COLUMN "duration_seconds";--> statement-breakpoint
ALTER TABLE "training_day_exercises" DROP COLUMN "load";--> statement-breakpoint
ALTER TABLE "training_day_exercises" DROP COLUMN "rir";--> statement-breakpoint
ALTER TABLE "training_day_exercises" RENAME COLUMN "set_rows" TO "sets";--> statement-breakpoint
ALTER TABLE "training_day_exercises" ADD COLUMN "is_linked_to_previous" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "training_day_exercises" ADD CONSTRAINT "training_day_exercises_sets_check" CHECK (jsonb_typeof("training_day_exercises"."sets") = 'array' and jsonb_array_length("training_day_exercises"."sets") <= 100);
