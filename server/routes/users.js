import express from 'express';
import { getAllUsers, createUser } from '../controllers/userController.js';
import { validate } from '../middleware/validate.js';
import { userSchema } from '../schemas/user.js';
import { handleError } from '../utils/errorHandler.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await getAllUsers(req, res);
  } catch (error) {
    handleError(error, res);
  }
});

router.post('/', validate(userSchema), async (req, res) => {
  try {
    await createUser(req, res);
  } catch (error) {
    handleError(error, res);
  }
});

export const usersRouter = router;