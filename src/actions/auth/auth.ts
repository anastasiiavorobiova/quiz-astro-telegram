import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { defineAction, ActionError } from "astro:actions";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { User } from "@/schema";
import {
  signUpSchema,
  lucia,
  loginSchema,
  createEmailVerificationToken,
} from "@/features/auth";
import { emailVerificationHTML, sendEmail } from "@/shared/lib/email";

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

        const verificationToken = await createEmailVerificationToken(
          userId,
          input.email,
        );

        const appUrl =
          import.meta.env.APP_URL || import.meta.env.PUBLIC_APP_URL;
        const verificationLink = `${appUrl}/api/verify-token.json?${verificationToken}`;

        await sendEmail({
          email: input.email,
          html: emailVerificationHTML(verificationLink),
          subject: "Email verification",
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
  loginUser: defineAction({
    handler: async (input, ctx) => {
      try {
        const validation = loginSchema.safeParse(input);
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

        if (usersMatching.length < 1) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "Incorrect username or password",
          });
        }

        const validPassword = await new Argon2id().verify(
          usersMatching[0].passwordHash,
          input.password,
        );

        if (!validPassword) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "Incorrect username or password",
          });
        }

        const session = await lucia.createSession(usersMatching[0].id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        ctx.cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );

        return { error: null, data: { message: "User has been logged in" } };
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
  logout: defineAction({
    handler: async (_input, ctx) => {
      try {
        if (!ctx.locals.session) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "No active session found",
          });
        }

        await lucia.invalidateSession(ctx.locals.session.id);

        const sessionCookie = lucia.createBlankSessionCookie();

        ctx.cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );

        return { error: null, data: { message: "User has been logged out" } };
      } catch (err) {
        if (err instanceof ActionError && err.code === "UNAUTHORIZED") {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "No active session found",
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
