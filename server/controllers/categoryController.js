import { Category } from '../models/Category.js';
import { AppError } from '../utils/errorHandler.js';

export async function getAllCategories(req, res) {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new AppError('Error fetching categories', 500, error.message);
  }
}

export async function createCategory(req, res) {
  try {
    const existingCategory = await Category.findByName(req.body.name);
    if (existingCategory) {
      throw new AppError('Category name already exists', 400);
    }

    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error creating category', 500, error.message);
  }
}