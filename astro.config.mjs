import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: 'never'
  },
  site: 'https://at-gamma.vercel.app/',
  integrations: [preact(),],
  prefetch: {prefetchAll: true},
});