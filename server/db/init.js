import { initializeDb } from '../config/database.js';
import { createTables } from './migrations/schema.js';

export async function initDb() {
  try {
    console.log('\n=== Initializing Turso Database ===');
    
    // Initialize database connection
    const connected = await initializeDb();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }

    // Create tables
    const success = await createTables();
    if (!success) {
      throw new Error('Failed to create database tables');
    }

    console.log('✓ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('\n❌ Database initialization error');
    console.error('Message:', error.message);
    return false;
  }
}