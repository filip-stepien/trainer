CREATE TYPE "public"."client_status" AS ENUM('active', 'paused', 'ended');--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clients_auth_user_id_unique" UNIQUE("auth_user_id")
);
--> statement-breakpoint
CREATE TABLE "coach_clients" (
	"coach_id" text NOT NULL,
	"client_id" uuid NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(50),
	"status" "client_status" DEFAULT 'active' NOT NULL,
	"started_at" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "coach_clients_coach_id_client_id_pk" PRIMARY KEY("coach_id","client_id")
);
--> statement-breakpoint
ALTER TABLE "coach_clients" ADD CONSTRAINT "coach_clients_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "coach_clients_coach_email_unique" ON "coach_clients" USING btree ("coach_id","email");--> statement-breakpoint
CREATE INDEX "coach_clients_coach_name_index" ON "coach_clients" USING btree ("coach_id","last_name","first_name");
