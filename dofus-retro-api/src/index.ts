import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { initDatabase } from './database';
import { seedDatabase } from './data/seed';

// Routes
import itemsRouter from './routes/items';
import weaponsRouter from './routes/weapons';
import resourcesRouter from './routes/resources';
import monstersRouter from './routes/monsters';
import setsRouter from './routes/sets';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Documentation statique
app.use('/docs', express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    service: 'Dofus Retro API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Info
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Dofus Retro API',
    version: '1.0.0',
    description: 'API REST pour les données de Dofus Retro (1.29)',
    documentation: '/docs',
    endpoints: {
      items: '/api/items',
      weapons: '/api/weapons',
      resources: '/api/resources',
      monsters: '/api/monsters',
      sets: '/api/sets'
    }
  });
});

// Routes API
app.use('/api/items', itemsRouter);
app.use('/api/weapons', weaponsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/monsters', monstersRouter);
app.use('/api/sets', setsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Endpoint non trouvé' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('❌ Erreur:', err);
  res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
});

// Initialisation
async function start() {
  try {
    console.log('🚀 Démarrage de Dofus Retro API...');
    
    // Initialiser la base de données
    await initDatabase();
    
    // Seeder avec les données de base
    await seedDatabase();
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📚 Documentation: http://localhost:${PORT}/docs`);
      console.log('');
      console.log('Endpoints disponibles:');
      console.log(`  • GET http://localhost:${PORT}/api/items`);
      console.log(`  • GET http://localhost:${PORT}/api/weapons`);
      console.log(`  • GET http://localhost:${PORT}/api/resources`);
      console.log(`  • GET http://localhost:${PORT}/api/monsters`);
      console.log(`  • GET http://localhost:${PORT}/api/sets`);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
  }
}

start();
