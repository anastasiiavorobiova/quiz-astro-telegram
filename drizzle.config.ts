import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: import.meta.env.DATABASE_URL || import.meta.env.PUBLIC_DATABASE_URL,
  },
});
