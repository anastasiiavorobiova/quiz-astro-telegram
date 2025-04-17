ALTER TABLE "answers" DROP CONSTRAINT "answers_answer_questions_choices_id_fk";
--> statement-breakpoint
ALTER TABLE "answers" ADD COLUMN "answer_id" integer;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_answer_id_questions_choices_id_fk" FOREIGN KEY ("answer_id") REFERENCES "public"."questions_choices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" DROP COLUMN "answer";