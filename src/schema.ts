import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["user", "admin"]);

export const User = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  email: text("email").unique().notNull(),
  emailVerified: boolean("email_verified").default(false),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: rolesEnum().default("user"),
});

export type InsertUser = typeof User.$inferInsert;
export type SelectUser = typeof User.$inferSelect;

export const Session = pgTable("sessions", {
  id: text("id").notNull().primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  userId: text("user_id").references(() => User.id, { onDelete: "cascade" }),
});

export type InsertSession = typeof Session.$inferInsert;
export type SelectSession = typeof Session.$inferSelect;

export const EmailVerificationToken = pgTable("email_verification_token", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").references(() => User.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  email: text("email").notNull(),
});

export type InsertEmailVerificationToken =
  typeof EmailVerificationToken.$inferInsert;
export type SelectEmailVerificationToken =
  typeof EmailVerificationToken.$inferSelect;
