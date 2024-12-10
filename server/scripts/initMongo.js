import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../../.env') });

async function initializeDatabase() {
  console.log('\n=== Initialisation de la base de données MongoDB ===\n');
  
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Jira';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✓ Connecté au serveur MongoDB');
    
    const db = client.db();
    console.log(`✓ Base de données sélectionnée: ${db.databaseName}`);
    
    // Création des collections avec validation
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'email'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'Nom de l\'utilisateur - requis'
            },
            email: {
              bsonType: 'string',
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
              description: 'Email valide - requis'
            }
          }
        }
      }
    });
    
    await db.createCollection('categories', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'color'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'Nom de la catégorie - requis'
            },
            color: {
              bsonType: 'string',
              pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
              description: 'Couleur hexadécimale - requis'
            }
          }
        }
      }
    });
    
    // Création des index
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ name: 1 });
    await db.collection('categories').createIndex({ name: 1 }, { unique: true });
    
    console.log('\n✅ Base de données initialisée avec succès!');
    console.log('- Collections créées: users, categories');
    console.log('- Index créés sur: email, name');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'initialisation:', error.message);
    throw error;
  } finally {
    await client.close();
  }
}

initializeDatabase().catch(console.error);