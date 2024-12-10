import { getDb } from '../config/database.js';

export class User {
  static async findAll() {
    const db = getDb();
    const result = await db.execute(`
      SELECT * FROM users 
      ORDER BY name
    `);
    return result.rows;
  }

  static async create(userData) {
    const db = getDb();
    const result = await db.execute({
      sql: `
        INSERT INTO users (name, email) 
        VALUES (?, ?) 
        RETURNING *
      `,
      args: [userData.name, userData.email]
    });
    return result.rows[0];
  }

  static async findById(id) {
    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [id]
    });
    return result.rows[0];
  }

  static async findByEmail(email) {
    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });
    return result.rows[0];
  }
}