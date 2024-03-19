import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  build: {
    assets: 'assets',
    inlineStylesheets: 'never' /* CSP. May hurt page speed becuase fetch resource */,
  },
  vite: {
    assets: 'assets',
    assetsInlineLimit: 0 /* CSP. May hurt page speed becuase fetch resource */,
  },
  site: 'https://at-gamma.vercel.app/',
  integrations: [preact(),],
  prefetch: {prefetchAll: true},
});