// @ts-check
import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';

// https://astro.build/config
// Note: Astro 6 removed 'hybrid' output. Using 'static' with Netlify adapter so Keystatic's
// server-rendered admin routes work, while the rest of the site stays statically generated.
// Keystatic's admin UI requires React.
export default defineConfig({
  output: 'static',
  adapter: netlify(),
  integrations: [
    react(),
    keystatic(),
    markdoc(),
  ],
});
