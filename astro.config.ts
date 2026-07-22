import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// User homepage repo: Logikinet.github.io → custom domain aqualeap.dev
// No project-level base path on root custom domain.
export default defineConfig({
  site: "https://aqualeap.dev",
  trailingSlash: "ignore",
  integrations: [mdx(), sitemap()],
  vite: {
    // @tailwindcss/vite plugin types may diverge from Astro's nested Vite types.
    plugins: [tailwindcss() as any],
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      wrap: true,
    },
  },
});
