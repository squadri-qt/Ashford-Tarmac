import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

export default defineConfig({
  site: 'https://at-gamma.vercel.app/',
  integrations: [preact()]
});