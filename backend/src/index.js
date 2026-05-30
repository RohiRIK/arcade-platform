import express from 'express';
import cors from 'cors';
import { gamesRouter } from './routes/games.js';
import { healthRouter } from './routes/health.js';
import { logRouter } from './routes/logs.js';
import { loadGames } from './services/gameRegistry.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS restricted to same-origin only (Security P2 fix)
app.use(cors({ origin: false }));
app.use(express.json());

const CONFIG_PATH = path.join(process.cwd(), 'config.json');
let config = {
  selfImprovement: { enabled: true, mode: 'apply', scope: ['games', 'ui', 'infra', 'docs'] }
};
if (existsSync(CONFIG_PATH)) {
  config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
}
app.locals.config = config;
app.locals.games = loadGames();

app.use('/api/games', gamesRouter);
app.use('/api/health', healthRouter);
app.use('/api/logs', logRouter);

app.get('/api/config', (req, res) => res.json(app.locals.config));
// PUT /api/config DISABLED — unauthenticated write is a security risk (P2 fix)
// Config changes must be made via file system or authenticated mechanism.
app.put('/api/config', (req, res) => {
  res.status(403).json({ error: 'Config modification disabled for security.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Arcade backend running on port ${PORT}`);
  console.log(`${app.locals.games.length} games loaded`);
});
