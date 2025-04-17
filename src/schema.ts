import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

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

export const Question = pgTable("questions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  question: text("question").notNull(),
});

export type InsertQuestion = typeof Question.$inferInsert;
export type SelectQuestion = typeof Question.$inferSelect;

export const QuestionChoice = pgTable("questions_choices", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  choice1: text("choice_1").notNull(),
  choice2: text("choice_2").notNull(),
  choice3: text("choice_3").notNull(),
  choice4: text("choice_4").notNull(),
  questionId: integer("question_id").references(() => Question.id, {
    onDelete: "cascade",
  }),
});

export type InsertQuestionChoice = typeof QuestionChoice.$inferInsert;
export type SelectQuestionChoice = typeof QuestionChoice.$inferSelect;

export const Answer = pgTable("answers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  answer: text("answer").notNull(),
  choice_id: integer("answer_id").references(() => QuestionChoice.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id").references(() => User.id, { onDelete: "cascade" }),
  questionId: integer("question_id").references(() => Question.id, {
    onDelete: "cascade",
  }),
});

export type InsertAnswer = typeof Answer.$inferInsert;
export type SelectAnswer = typeof Answer.$inferSelect;
