// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO: set to Khor's real domain before launch. Until this is set, the canonical
  // link and the absolute og:image/og:url are omitted rather than guessed.
  // site: 'https://example.com',
  vite: {
    plugins: [tailwindcss()]
  }
});
