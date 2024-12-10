import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

let client;

export async function initializeDb() {
  try {
    console.log('Connecting to Turso database...');
    
    // Format the URL correctly for Turso
    const url = process.env.TURSO_DB_URL.replace('libsql://', 'https://');
    console.log('URL:', url);
    
    client = createClient({
      url: url,
      authToken: process.env.TURSO_AUTH_TOKEN
    });

    // Test the connection
    await client.execute('SELECT 1');
    console.log('✓ Connected to Turso database successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    if (error.message.includes('authentication failed')) {
      console.error('Please check your TURSO_AUTH_TOKEN');
    }
    return false;
  }
}

export function getDb() {
  if (!client) {
    throw new Error('Database not initialized. Call initializeDb() first.');
  }
  return client;
}