CREATE TYPE "public"."training_block_status" AS ENUM('draft', 'active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."training_day_exercise_section" AS ENUM('warmup', 'main');--> statement-breakpoint
CREATE TYPE "public"."training_day_exercise_target_type" AS ENUM('repetitions', 'duration');--> statement-breakpoint
CREATE TABLE "training_block_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"training_block_id" uuid NOT NULL,
	"version_number" integer,
	"name" varchar(150) NOT NULL,
	"description" text,
	"duration_weeks" integer,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "training_block_versions_publication_check" CHECK (("training_block_versions"."published_at" is null and "training_block_versions"."version_number" is null) or ("training_block_versions"."published_at" is not null and "training_block_versions"."version_number" is not null)),
	CONSTRAINT "training_block_versions_duration_weeks_check" CHECK ("training_block_versions"."duration_weeks" is null or ("training_block_versions"."duration_weeks" >= 1 and "training_block_versions"."duration_weeks" <= 104))
);
--> statement-breakpoint
CREATE TABLE "training_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coach_id" text NOT NULL,
	"client_id" uuid NOT NULL,
	"status" "training_block_status" DEFAULT 'draft' NOT NULL,
	"start_date" date DEFAULT current_date NOT NULL,
	"active_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "training_blocks_active_version_check" CHECK ("training_blocks"."status" <> 'active' or "training_blocks"."active_version_id" is not null)
);
--> statement-breakpoint
CREATE TABLE "training_day_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"training_day_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL,
	"section" "training_day_exercise_section" NOT NULL,
	"position" integer NOT NULL,
	"name" varchar(150) NOT NULL,
	"instructions" text,
	"video_url" text,
	"sets" integer,
	"target_type" "training_day_exercise_target_type" DEFAULT 'repetitions' NOT NULL,
	"reps" varchar(50),
	"duration_seconds" integer,
	"load" varchar(50),
	"tempo" varchar(50),
	"rir" varchar(50),
	"rest_seconds" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "training_day_exercises_position_check" CHECK ("training_day_exercises"."position" >= 0),
	CONSTRAINT "training_day_exercises_sets_check" CHECK ("training_day_exercises"."sets" is null or ("training_day_exercises"."sets" >= 1 and "training_day_exercises"."sets" <= 100)),
	CONSTRAINT "training_day_exercises_rest_seconds_check" CHECK ("training_day_exercises"."rest_seconds" is null or ("training_day_exercises"."rest_seconds" >= 0 and "training_day_exercises"."rest_seconds" <= 3600)),
	CONSTRAINT "training_day_exercises_duration_seconds_check" CHECK ("training_day_exercises"."duration_seconds" is null or ("training_day_exercises"."duration_seconds" >= 1 and "training_day_exercises"."duration_seconds" <= 86400)),
	CONSTRAINT "training_day_exercises_target_check" CHECK (("training_day_exercises"."target_type" = 'repetitions' and "training_day_exercises"."duration_seconds" is null) or ("training_day_exercises"."target_type" = 'duration' and "training_day_exercises"."reps" is null and "training_day_exercises"."duration_seconds" is not null))
);
--> statement-breakpoint
CREATE TABLE "training_days" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"training_block_version_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "training_days_position_check" CHECK ("training_days"."position" >= 0)
);
--> statement-breakpoint
ALTER TABLE "training_block_versions" ADD CONSTRAINT "training_block_versions_training_block_id_training_blocks_id_fk" FOREIGN KEY ("training_block_id") REFERENCES "public"."training_blocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_blocks" ADD CONSTRAINT "training_blocks_active_version_id_training_block_versions_id_fk" FOREIGN KEY ("active_version_id") REFERENCES "public"."training_block_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_blocks" ADD CONSTRAINT "training_blocks_coach_client_foreign_key" FOREIGN KEY ("coach_id","client_id") REFERENCES "public"."coach_clients"("coach_id","client_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_day_exercises" ADD CONSTRAINT "training_day_exercises_training_day_id_training_days_id_fk" FOREIGN KEY ("training_day_id") REFERENCES "public"."training_days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_day_exercises" ADD CONSTRAINT "training_day_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_days" ADD CONSTRAINT "training_days_training_block_version_id_training_block_versions_id_fk" FOREIGN KEY ("training_block_version_id") REFERENCES "public"."training_block_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "training_block_versions_number_unique" ON "training_block_versions" USING btree ("training_block_id","version_number") WHERE "training_block_versions"."version_number" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "training_block_versions_draft_unique" ON "training_block_versions" USING btree ("training_block_id") WHERE "training_block_versions"."published_at" is null;--> statement-breakpoint
CREATE INDEX "training_block_versions_block_published_index" ON "training_block_versions" USING btree ("training_block_id","published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "training_blocks_active_coach_client_unique" ON "training_blocks" USING btree ("coach_id","client_id") WHERE "training_blocks"."status" = 'active';--> statement-breakpoint
CREATE INDEX "training_blocks_coach_client_updated_index" ON "training_blocks" USING btree ("coach_id","client_id","updated_at");--> statement-breakpoint
CREATE INDEX "training_day_exercises_day_section_position_index" ON "training_day_exercises" USING btree ("training_day_id","section","position","id");--> statement-breakpoint
CREATE INDEX "training_days_version_position_index" ON "training_days" USING btree ("training_block_version_id","position","id");