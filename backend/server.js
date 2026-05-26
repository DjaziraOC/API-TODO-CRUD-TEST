const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config(); // Charge les variables d'environnement depuis un fichier .env

// Import des routes - Séparation modulaire des fonctionnalités
const authRoutes = require('./routes/authRoutes'); // Routes d'authentification
const taskRoutes = require('./routes/taskRoutes'); // Routes de gestion des tâches

// Initialisation de l'application Express
const app = express();
app.set('trust proxy', 1); // Trust first proxy
// Configuration du port avec fallback sur 5000 si non défini
const PORT = process.env.PORT || 5000;
// URI MongoDB avec valeur par défaut pour le développement local
const MONGO_URI = process.env.MONGODB_URI  || 'mongodb://localhost:27017/todo_app';

// Configuration CORS - Contrôle des origines autorisées
// Lit les origines depuis .env et les transforme en tableau
const allowedOrigins = 
     ['http://localhost:3000','http://localhost:5173']; // Valeurs par défaut  

if (process.env.CORS_ORIGINS) {
  allowedOrigins = process.env.CORS_ORIGINS.split(',').map(origin => origin.trim());
  console.log('🔒 CORS depuis variable d\'environnement:', allowedOrigins);
} else {
  console.log('🔒 CORS avec valeurs par défaut:', allowedOrigins);
}

console.log('🔒 Origines CORS autorisées:', allowedOrigins);

const corsOptions = {
   origin: function (origin, callback) {
    // Permet les requêtes sans origin (ex: appels serveur-à-serveur, outils CLI)
      if (!origin) return callback(null, true);
    
    // Vérifie si l'origine est dans la liste autorisée
      if (allowedOrigins.includes(origin)) {
      callback(null, true);
      } else {
      console.warn(`❌ CORS: Origine refusée - ${origin}`);
      callback(new Error(`Origin ${origin} non autorisée par CORS`));
      }
  },
  credentials: true, // Autorise les cookies / headers d'authentification
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // Headers autorisés
};


// Configuration du rate limiting - Protection contre les attaques par force brute
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requêtes max par fenêtre
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.', // Message personnalisé
  skipSuccessfulRequests: true,// Ne compte pas les requêtes réussies (optionnel)
});

// Middleware - Exécutés dans l'ordre pour chaque requête

app.use(helmet({ // Sécurise les headers HTTP
  crossOriginResourcePolicy: { policy: "cross-origin" } // Permet le partage de ressources
}));
app.use(cors(corsOptions)); // Applique la politique CORS
app.use(express.json()); // Parse le corps des requêtes en JSON
app.use(express.urlencoded({ extended: true })); // Parse les données de formulaire
app.use(morgan('dev')); // Logging des requêtes HTTP en mode développement
app.use('/api', limiter); // Applique le rate limiting uniquement sur les routes /api


// Connexion à MongoDB - Fonction asynchrone avec gestion d'erreur
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI); // Connexion à la base de données
    console.log('✅ MongoDB connecté avec succès'); // Message de succès
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message); // Log d'erreur
    process.exit(1); // Arrête l'application en cas d'échec de connexion
  }
};

connectDB(); // Appel de la fonction de connexion

// Routes principales - Montage des routeurs
app.use('/api/auth', authRoutes); // Toutes les routes d'auth commencent par /api/auth
app.use('/api/tasks', taskRoutes); // Toutes les routes de tâches commencent par /api/tasks

// log pour vérifier
console.log('Routes montées:');
console.log('  /api/auth → authRoutes');
console.log('  /api/tasks → taskRoutes');

// Route racine - Endpoint par défaut

app.get('/', (req, res) => {
  res.json({
    message: 'API Todo Backend - Version Complète',
    version: '1.0.0',
    status: 'Toutes les routes sont actives',
    database: mongoose.connection.readyState === 1 ? 'connecté' : 'déconnecté',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      docs: '/api-docs',
      health: '/health'
    }
  });
});

// Route health - Pour le monitoring et les health checks
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK', // Statut général
    timestamp: new Date().toISOString(), // Horodatage ISO
    uptime: process.uptime(), // Temps de fonctionnement du serveur
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', // État DB
    memory: process.memoryUsage() // Utilisation mémoire du processus
  });
});

//Documentation API - Auto-documentation des endpoints disponibles
app.get('/api-docs', (req, res) => {
  res.json({
    endpoints: {
      auth: {
        signup: { method: 'POST', path: '/api/auth/signup' }, // Inscription
        login: { method: 'POST', path: '/api/auth/login' }, // Connexion
        profile: { method: 'GET', path: '/api/auth/profile' }, // Profil utilisateur
        refresh: { method: 'POST', path: '/api/auth/refresh-token' } // Rafraîchissement token
      }
      ,
      tasks: {
        create: { method: 'POST', path: '/api/tasks' }, // Création tâche
        getAll: { method: 'GET', path: '/api/tasks' }, // Liste tâches
        getOne: { method: 'GET', path: '/api/tasks/:id' }, // Détail tâche
        update: { method: 'PUT', path: '/api/tasks/:id' }, // Mise à jour
        delete: { method: 'DELETE', path: '/api/tasks/:id' }, // Suppression
        stats: { method: 'GET', path: '/api/tasks/stats' } // Statistiques
      }
    }
  });
});


//Gestionnaire d'erreurs global - Intercepte toutes les erreurs non gérées
app.use((err, req, res, next) => {
  
  console.error('Erreur:', err.stack); // Log complet de l'erreur
  
  const statusCode = err.statusCode || 500; // Code statut HTTP (500 par défaut)
  const message = err.message || 'Erreur interne du serveur'; // Message d'erreur
  
  res.status(statusCode).json({
    error: message, // Message d'erreur au client
    // Inclut la stack trace uniquement en environnement de développement
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

//Démarrage du serveur HTTP

app.listen(PORT, () => {
  console.log(`🚀 Backend démarré sur http://localhost:${PORT}`);
  console.log(`📁 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB URI: ${process.env.MONGODB_URI ? 'Définie' : 'Non définie'}`);
  console.log(`✅ Toutes les routes sont actives`);
  console.log(`📋 Routes disponibles:`);
  console.log(`   - /api/auth (POST /signup, POST /login, GET /profile, etc.)`);
  console.log(`   - /api/tasks (CRUD complet - authentification requise)`);
  console.log(`   - /health (health check)`);
  console.log(`   - /api-docs (documentation API)`);
});