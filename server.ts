import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  // Enable Cross-Origin Isolation headers so SharedArrayBuffer & FFmpeg.wasm work on localhost
  app.use((_req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    next();
  });

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      app: 'MetaShield Studio',
      crossOriginIsolated: true,
      timestamp: new Date().toISOString(),
    });
  });

  const distPath = path.resolve(__dirname, 'dist');
  const isProd = process.env.NODE_ENV === 'production' || fs.existsSync(distPath);

  if (isProd && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`\n========================================================`);
    console.log(`  MetaShield Studio запущен локально!`);
    console.log(`  Локальный адрес:   http://localhost:${port}`);
    console.log(`  SharedArrayBuffer: АКТИВЕН (COOP/COEP headers)`);
    console.log(`========================================================\n`);
  });
}

void startServer();
