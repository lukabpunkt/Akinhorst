// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages baut mit BASE_PATH=/Akinhorst (siehe .github/workflows/deploy.yml); Netlify/eigene Domain ohne
export default defineConfig({
  site: "https://bakin-event.de",
  base: process.env.BASE_PATH || "/",
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "always" },
  integrations: [
    sitemap({
      filter: (page) => !["/danke", "/404", "/mietbedingungen"].some((p) => page.includes(p)),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
