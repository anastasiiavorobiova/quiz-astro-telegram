import { defineConfig as defineViteConfig, mergeConfig } from "vite";
import {
  coverageConfigDefaults,
  defineConfig as defineVitestConfig,
} from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const viteConfig = defineViteConfig({
  plugins: [react()],
});

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["**/*.test.{js,ts,jsx,tsx}"],
    coverage: {
      exclude: [
        ...coverageConfigDefaults.exclude,
        ".prettierrc.mjs",
        "astro.config.mjs",
        "eslint.config.mjs",
        "vitest.config.ts",
        ".astro/**/*",
        "dist/**/*",
        "src/**/*.astro",
      ],
    },
  },
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "./src") },
      {
        find: "astro:transitions/client",
        replacement: resolve(__dirname, "./src/shared/lib/tests/mocks"),
      },
      {
        find: "astro:actions",
        replacement: resolve(__dirname, "./src/shared/lib/tests/mocks"),
      },
      {
        find: "astro:env/client",
        replacement: resolve(__dirname, "./src/shared/lib/tests/mocks"),
      },
    ],
  },
});

export default mergeConfig(viteConfig, vitestConfig);
