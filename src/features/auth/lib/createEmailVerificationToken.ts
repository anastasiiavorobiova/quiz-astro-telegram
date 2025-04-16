import { TimeSpan, createDate } from "oslo";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { EmailVerificationToken } from "@/schema";
import { generateIdFromEntropySize } from "lucia";

export async function createEmailVerificationToken(
  userId: string,
  email: string,
): Promise<string> {
  await db
    .delete(EmailVerificationToken)
    .where(eq(EmailVerificationToken.userId, userId));

  const tokenId = generateIdFromEntropySize(25);

  await db.insert(EmailVerificationToken).values({
    id: tokenId,
    userId,
    email,
    expiresAt: createDate(new TimeSpan(2, "h")),
  });

  return tokenId;
}
