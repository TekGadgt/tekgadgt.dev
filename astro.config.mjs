// @ts-check
import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';

// https://astro.build/config
// Keystatic's admin UI requires React and server-rendered routes.
export default defineConfig({
  site: 'https://ryanmcgovern.dev',
  output: 'static',
  adapter: netlify(),
  integrations: [
    react(),
    keystatic(),
    markdoc(),
  ],
});
