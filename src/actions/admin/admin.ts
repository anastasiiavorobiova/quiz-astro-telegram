import { db } from "@/db";
import { lucia } from "@/features/auth";
import { User } from "@/schema";
import { ActionError, defineAction } from "astro:actions";
import { eq } from "drizzle-orm";

export const admin = {
  deleteUser: defineAction({
    handler: async (input, ctx) => {
      try {
        const sessionId = ctx.locals.session?.id || "";
        const { session, user } = await lucia.validateSession(sessionId);
        const isAdmin = user && user.role === "admin";

        if (!isAdmin || !session) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Please, sign in",
          });
        }

        const usersMatching = await db
          .select()
          .from(User)
          .where(eq(User.email, input));

        if (usersMatching.length < 1) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "A user doesn't exist",
          });
        }

        await db.delete(User).where(eq(User.email, input));

        return {
          error: false,
          data: { message: "A user has been successfully deleted" },
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
