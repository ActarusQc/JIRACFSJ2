import { User } from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new AppError('Error fetching users', 500, error.message);
  }
}

export async function createUser(req, res) {
  try {
    const existingUser = await User.findByEmail(req.body.email);
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error creating user', 500, error.message);
  }
}

export async function notifyUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Send notification logic here
    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new AppError('Error sending notification', 500, error.message);
  }
}