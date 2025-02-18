import process from 'node:process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

process.env.BROWSER = 'google-chrome';
process.env.BROWSER_ARGS = '--incognito';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      include: ['src/**'],
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
