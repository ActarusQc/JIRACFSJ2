import express from 'express';
import { getDb } from '../config/database.js';
import { handleError } from '../utils/errorHandler.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const db = getDb();
    await db.execute('SELECT 1');
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        type: 'Turso SQLite'
      }
    });
  } catch (error) {
    handleError(error, res);
  }
});

export const systemRouter = router;