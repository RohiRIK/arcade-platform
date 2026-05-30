import { Router } from 'express';
import { readdirSync, readFileSync, existsSync } from 'fs';
import path from 'path';

export const logRouter = Router();
const LOGS_DIR = path.join(process.cwd(), '..', 'logs');

logRouter.get('/', (req, res) => {
  if (!existsSync(LOGS_DIR)) return res.json([]);
  const files = readdirSync(LOGS_DIR).filter(f => f.endsWith('.json')).sort().reverse().slice(0, 20);
  const logs = files.map(f => JSON.parse(readFileSync(path.join(LOGS_DIR, f), 'utf-8')));
  res.json(logs);
});
