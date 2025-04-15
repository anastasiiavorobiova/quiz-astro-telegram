import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { defineAction, ActionError } from "astro:actions";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { User } from "@/schema";
import { signUpSchema, lucia } from "@/features/auth";

export const auth = {
  createUser: defineAction({
    handler: async (input, ctx) => {
      try {
        const validation = signUpSchema.safeParse(input);
        let zodErrors = {};

        if (!validation.success) {
          validation.error.issues.forEach((issue) => {
            zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
          });
        }

        if (Object.keys(zodErrors).length > 0) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: JSON.stringify(zodErrors),
          });
        }

        const usersMatching = await db
          .select()
          .from(User)
          .where(eq(User.email, input.email));

        if (usersMatching.length > 0) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "Something went wrong",
          });
        }

        const userId = generateId(16);
        const hashedPassword = await new Argon2id().hash(input.password);

        await db.insert(User).values({
          id: userId,
          email: input.email,
          username: input.email,
          passwordHash: hashedPassword,
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        ctx.cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );

        return { error: null, data: { message: "User has been created" } };
      } catch (err) {
        if (err instanceof ActionError && err.code === "BAD_REQUEST") {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: err.message,
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
