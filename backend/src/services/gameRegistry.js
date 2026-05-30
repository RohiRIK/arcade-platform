import { readdirSync, readFileSync, existsSync } from 'fs';
import path from 'path';

const GAMES_DIR = path.join(process.cwd(), 'src', 'games');

export function loadGames() {
  const games = [];
  if (!existsSync(GAMES_DIR)) return games;
  
  for (const dir of readdirSync(GAMES_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const metaPath = path.join(GAMES_DIR, dir.name, 'meta.json');
    if (existsSync(metaPath)) {
      const meta = JSON.parse(readFileSync(metaPath, 'utf-8'));
      games.push({ id: dir.name, ...meta });
    }
  }
  return games;
}
