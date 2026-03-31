// @ts-check
import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';

// https://astro.build/config
// Using 'server' output so Keystatic's admin routes work on Netlify in production.
// All regular pages export prerender = true to stay statically generated.
// Keystatic's admin UI requires React.
export default defineConfig({
  site: 'https://ryanmcgovern.dev',
  output: 'server',
  adapter: netlify(),
  integrations: [
    react(),
    keystatic(),
    markdoc(),
  ],
});
