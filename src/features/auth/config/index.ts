import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/db";
import { User, Session } from "@/schema";

// @ts-expect-error copied from lib docs
const adapter = new DrizzlePostgreSQLAdapter(db, Session, User);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      role: attributes.role,
      email: attributes.email,
    };
  },
});

interface DatabaseUserAttributes {
  role: string;
  email: string;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
