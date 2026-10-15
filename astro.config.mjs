// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.hannajib.web.id",
  output: 'server',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap({
    filter: (page) => !page.includes("/admin"),
    serialize(item) {
      return {
        ...item,
        lastmod: new Date().toISOString(),
      };
    },
  })],
  adapter: vercel(),
});