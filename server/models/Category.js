import { getDb } from '../config/database.js';

export class Category {
  static async findAll() {
    const db = getDb();
    const result = await db.execute(`
      SELECT * FROM categories 
      ORDER BY name
    `);
    return result.rows;
  }

  static async create(categoryData) {
    const db = getDb();
    const result = await db.execute({
      sql: `
        INSERT INTO categories (name, color) 
        VALUES (?, ?) 
        RETURNING *
      `,
      args: [categoryData.name, categoryData.color]
    });
    return result.rows[0];
  }

  static async findById(id) {
    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT * FROM categories WHERE id = ?',
      args: [id]
    });
    return result.rows[0];
  }

  static async findByName(name) {
    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT * FROM categories WHERE name = ?',
      args: [name]
    });
    return result.rows[0];
  }
}