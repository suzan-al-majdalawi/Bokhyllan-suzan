// Vitest läser bara den här filen när den finns, därför slås vite.config.js ihop in här
// (annars försvinner React-pluginet). Komponenttesterna heter *.test.jsx och ligger i src/.
// Playwright-testerna i e2e/ heter *.spec.js och körs inte av Vitest.
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.test.jsx'],
    },
  }),
);
