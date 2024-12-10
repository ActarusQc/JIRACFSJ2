import express from 'express';
import { getAllCategories, createCategory } from '../controllers/categoryController.js';
import { validate } from '../middleware/validate.js';
import { categorySchema } from '../schemas/category.js';
import { handleError } from '../utils/errorHandler.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await getAllCategories(req, res);
  } catch (error) {
    handleError(error, res);
  }
});

router.post('/', validate(categorySchema), async (req, res) => {
  try {
    await createCategory(req, res);
  } catch (error) {
    handleError(error, res);
  }
});

export const categoriesRouter = router;