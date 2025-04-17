CREATE TABLE "questions_choices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "questions_choices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"choice_1" text NOT NULL,
	"choice_2" text NOT NULL,
	"choice_3" text NOT NULL,
	"choice_4" text NOT NULL,
	"question_id" integer
);
--> statement-breakpoint
ALTER TABLE "answers" ALTER COLUMN "answer" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions_choices" ADD CONSTRAINT "questions_choices_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_answer_questions_choices_id_fk" FOREIGN KEY ("answer") REFERENCES "public"."questions_choices"("id") ON DELETE cascade ON UPDATE no action;