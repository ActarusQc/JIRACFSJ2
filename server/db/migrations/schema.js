import { getDb } from '../../config/database.js';

export async function createTables() {
  const db = getDb();
  
  try {
    // Users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        color TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        CHECK (color GLOB '#[A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9]' 
               OR color GLOB '#[A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9]')
      )
    `);

    // Tickets table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
        priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
        assignee_id INTEGER,
        category_id INTEGER,
        start_date TEXT,
        end_date TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    // Create indexes for better performance
    await db.execute('CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_tickets_assignee ON tickets(assignee_id)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category_id)');

    console.log('✓ All tables created successfully');
    return true;
  } catch (error) {
    console.error('Migration error:', error);
    return false;
  }
}