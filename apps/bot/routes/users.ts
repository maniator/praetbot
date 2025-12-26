import express, { Request, Response, NextFunction } from 'express';
import { getCookies } from '@praetbot/shared-lib/cookies';

const router = express.Router();

/* GET users listing. */
router.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const cookies = await getCookies();
    res.json(cookies);
  } catch {
    res.status(500).json({ error: 'Failed to fetch cookies' });
  }
});

export default router;
