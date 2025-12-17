import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node20',
    outDir: 'dist',
    lib: {
      entry: {
        app: './app.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'express',
        'discord.js',
        'mongodb',
        'body-parser',
        'cookie-parser',
        'morgan',
        'hbs',
        'debug',
        'serve-favicon',
      ],
    },
  },
});