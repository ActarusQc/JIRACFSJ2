import express from 'express';
import cors from 'cors';
import { usersRouter } from '../routes/users.js';
import { categoriesRouter } from '../routes/categories.js';
import { ticketsRouter } from '../routes/tickets.js';
import { systemRouter } from '../routes/system.js';
import { handleError } from '../utils/errorHandler.js';

export function configureApp() {
  const app = express();
  
  // Configure CORS
  app.use(cors());
  
  // Parse JSON bodies
  app.use(express.json());
  
  // Configure routes
  app.use('/api/users', usersRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/tickets', ticketsRouter);
  app.use('/api/system', systemRouter);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    handleError(err, res);
  });
  
  return app;
}