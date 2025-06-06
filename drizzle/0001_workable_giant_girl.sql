ALTER TABLE "todos" ADD COLUMN "created_at" timestamp (3) DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "last_updated" timestamp (3) DEFAULT now() NOT NULL;