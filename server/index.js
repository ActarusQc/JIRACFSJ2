import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { initDb } from './db/init.js';
import { configureApp } from './config/app.js';

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, './.env') });

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('\n=== Starting server ===');
    
    // Initialize database
    const isConnected = await initDb();
    if (!isConnected) {
      throw new Error('Failed to initialize database');
    }
    
    // Configure and start Express
    const app = configureApp();
    
    app.listen(PORT, () => {
      console.log(`\n✓ Server running at http://localhost:${PORT}`);
      console.log('✓ API endpoints available at:');
      console.log(`  - http://localhost:${PORT}/api/users`);
      console.log(`  - http://localhost:${PORT}/api/categories`);
      console.log(`  - http://localhost:${PORT}/api/system/health`);
    });

    // Handle server shutdown
    process.on('SIGTERM', () => {
      console.log('Server shutting down...');
      process.exit(0);
    });

  } catch (error) {
    console.error('\n❌ Server initialization error:', error.message);
    process.exit(1);
  }
}

startServer();