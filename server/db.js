import mongoose from 'mongoose';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kanban';

export async function initDb() {
  try {
    console.log('\n=== Connexion à MongoDB ===');
    console.log('URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    await mongoose.connect(MONGODB_URI);
    
    // Test the connection
    await mongoose.connection.db.admin().ping();
    console.log('✓ Connecté à MongoDB avec succès');
    
    // Handle connection errors after initial connection
    mongoose.connection.on('error', (error) => {
      console.error('❌ Erreur de connexion MongoDB:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Déconnecté de MongoDB');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✓ Reconnecté à MongoDB');
    });

  } catch (error) {
    console.error('\n❌ ERREUR DE CONNEXION MONGODB');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}

export function getDb() {
  return mongoose.connection;
}