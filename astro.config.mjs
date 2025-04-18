// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  output: "server",

  image: {
    domains: ["astro.build"],
  },

  build: {
    assets: "assets",
  },

  security: {
    checkOrigin: true,
  },

  prefetch: {
    defaultStrategy: "hover",
  },

  adapter: netlify(),

  vite: {
    plugins: [tailwindcss()],
  },
});
