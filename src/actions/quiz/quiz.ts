import { db } from "@/db";
import { Answer, type InsertAnswer } from "@/schema";
import { ActionError, defineAction } from "astro:actions";
import { eq } from "drizzle-orm";

export const quiz = {
  sendResults: defineAction({
    handler: async (input, ctx) => {
      try {
        if (!ctx.locals.user) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Please, sign in",
          });
        }

        const existingAnswers = await db
          .select()
          .from(Answer)
          .where(eq(Answer.userId, String(ctx.locals.user?.id)));

        if (existingAnswers.length > 0) {
          await db
            .delete(Answer)
            .where(eq(Answer.userId, String(ctx.locals.user?.id)));
        }

        const results = input.map((elem: Partial<InsertAnswer>) => ({
          ...elem,
          question_id: input.question_id,
          userId: ctx.locals.user?.id,
        }));

        await db.insert(Answer).values(results);

        return {
          error: false,
          data: { message: "Your results have been sent" },
        };
      } catch (err) {
        if (err instanceof ActionError && err.code === "UNAUTHORIZED") {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Please, sign in",
          });
        }

        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  }),
};
