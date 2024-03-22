import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  build: {
    assets: 'assets'
    // inlineStylesheets: 'never' /* CSP. May hurt page speed becuase fetch resource */,
  },
  vite: {
    build: {
      assets: 'assets',
      //assetsInlineLimit: 0 /* CSP. May hurt page speed becuase fetch resource */,
      assetsInlineLimit: 16384
    }
  },
  site: 'https://at-gamma.vercel.app/',
  integrations: [preact(), compress({Exclude: ['ashford-tarmac-logo.svg', 'roller-anim.svg', 'clients.svg']})],
  prefetch: false
});
