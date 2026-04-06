CREATE TABLE "members" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"area" text NOT NULL,
	"avatar_initials" text NOT NULL,
	CONSTRAINT "members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "objectives" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text NOT NULL,
	"code" text NOT NULL,
	"title" text NOT NULL,
	"focus" text,
	"quarter" text NOT NULL,
	"year" integer NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"owner" text
);
--> statement-breakpoint
CREATE TABLE "key_results" (
	"id" text PRIMARY KEY NOT NULL,
	"objective_id" text NOT NULL,
	"code" text NOT NULL,
	"title" text NOT NULL,
	"category" text,
	"target_value" real,
	"target_unit" text,
	"current_value" real DEFAULT 0,
	"target_text" text,
	"status" text DEFAULT 'on-track' NOT NULL,
	"owner" text,
	"due_date" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "check_ins" (
	"id" text PRIMARY KEY NOT NULL,
	"key_result_id" text NOT NULL,
	"date" text NOT NULL,
	"value" real,
	"note" text,
	"created_by" text
);
--> statement-breakpoint
CREATE TABLE "objective_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"objective_id" text NOT NULL,
	"author" text NOT NULL,
	"body" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "key_results" ADD CONSTRAINT "key_results_objective_id_objectives_id_fk" FOREIGN KEY ("objective_id") REFERENCES "public"."objectives"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_key_result_id_key_results_id_fk" FOREIGN KEY ("key_result_id") REFERENCES "public"."key_results"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "objective_comments" ADD CONSTRAINT "objective_comments_objective_id_objectives_id_fk" FOREIGN KEY ("objective_id") REFERENCES "public"."objectives"("id") ON DELETE cascade ON UPDATE no action;
