import { Router } from 'express';
export const gamesRouter = Router();

gamesRouter.get('/', (req, res) => {
  res.json(req.app.locals.games);
});

gamesRouter.get('/:id', (req, res) => {
  const game = req.app.locals.games.find(g => g.id === req.params.id);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  res.json(game);
});
