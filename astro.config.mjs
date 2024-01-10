import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

export default defineConfig({
  site: 'https://astro-blog-teal-five.vercel.app',
  integrations: [preact()]
});