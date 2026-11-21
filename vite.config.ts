import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import devServer from '@hono/vite-dev-server';
import adapter from '@hono/vite-dev-server/cloudflare';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    devServer({
      adapter,
      entry: 'src/api/index.ts',
      exclude: [/^\/(?!(api)).*/], // Only let Hono handle /api routes in dev
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
