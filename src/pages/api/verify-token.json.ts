import type { APIRoute } from "astro";
import { isWithinExpirationDate } from "oslo";
import { eq } from "drizzle-orm";
import { lucia } from "@/features/auth";
import { db } from "@/db";
import { EmailVerificationToken, User } from "@/schema";

export const GET: APIRoute = async (context) => {
  const { url } = context;
  const [_endpoint, verificationToken] = url.toString().split("?");

  try {
    const token = await db
      .select()
      .from(EmailVerificationToken)
      .where(eq(EmailVerificationToken.id, verificationToken));

    if (!token.length) {
      throw new Error("The token does not exist");
    }

    if (!isWithinExpirationDate(token[0].expiresAt)) {
      throw new Error("The token expired");
    }

    await db
      .delete(EmailVerificationToken)
      .where(eq(EmailVerificationToken.id, verificationToken));

    const user = await db
      .select()
      .from(User)
      .where(eq(User.id, String(token[0].userId)));

    if (!user.length) {
      throw new Error("The user does not exist");
    }

    if (user[0].email !== token[0].email) {
      throw new Error("Emails don't match");
    }

    await lucia.invalidateUserSessions(user[0].id);
    await db
      .update(User)
      .set({ emailVerified: true })
      .where(eq(User.id, user[0].id));

    const session = await lucia.createSession(user[0].id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return context.redirect("/");
  } catch (_error) {
    return context.redirect("/");
  }
};
