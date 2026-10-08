import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { liveJobsPlugin } from './server/jobs.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), liveJobsPlugin(), {
    name: 'localhost-auth-origin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Neon Auth trusts localhost. Keep OAuth callbacks and cookies on that origin.
        if (req.headers.host === '127.0.0.1:5173') {
          res.writeHead(307, { Location: `http://localhost:5173${req.url ?? '/'}` });
          res.end();
          return;
        }
        next();
      });
    },
  }],
  server: { proxy: { '/api': 'http://127.0.0.1:3000' } },
})
