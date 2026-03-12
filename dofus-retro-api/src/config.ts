/**
 * Configuration de l'API Dofus Retro
 */

module.exports = {
  // Serveur
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Base de données
  database: {
    path: process.env.DB_PATH || './database.sqlite',
    verbose: process.env.NODE_ENV === 'development'
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000 // limiter par IP
  },
  
  // Cache
  cache: {
    ttl: 60 * 5 // 5 minutes
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  
  // Pagination
  pagination: {
    defaultLimit: 50,
    maxLimit: 500
  }
};
