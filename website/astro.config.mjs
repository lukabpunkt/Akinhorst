// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://bakin-event.de",
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "always" },
  integrations: [
    sitemap({
      filter: (page) => !["/danke", "/404", "/mietbedingungen"].some((p) => page.includes(p)),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
