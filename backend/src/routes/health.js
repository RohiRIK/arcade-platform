import { Router } from 'express';
export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    games: req.app.locals.games.length,
    timestamp: new Date().toISOString()
  });
});
