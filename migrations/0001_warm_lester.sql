CREATE TABLE "email_verification_token" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"expires_at" timestamp NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_verification_token" ADD CONSTRAINT "email_verification_token_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;