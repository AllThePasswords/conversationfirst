import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'google-fonts-proxy',
      configureServer(server) {
        server.middlewares.use('/api/gfonts', async (_req, res) => {
          try {
            const response = await fetch('https://fonts.google.com/metadata/fonts');
            const data = await response.text();
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.end(data);
          } catch {
            res.statusCode = 502;
            res.end(JSON.stringify({ error: 'Failed to fetch Google Fonts metadata' }));
          }
        });
      },
    },
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    globals: true,
  },
})
