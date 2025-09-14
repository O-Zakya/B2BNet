const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const knexLib = require('knex');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ CONFIGURATION CORS AMÉLIORÉE
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const knex = knexLib({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'b2bnet',
    password: process.env.DB_PASSWORD || 'B-!too!-BNET1234@',
    database: process.env.DB_NAME || 'B2BNet_db',
    charset: 'utf8mb4',
    timezone: '+00:00'
  }
});

// ✅ TESTER LA CONNEXION KNEX
knex.raw('SELECT 1+1 AS test')
  .then(result => {
    console.log('✅ Connecté à MySQL via Knex');
    console.log('🔍 Test MySQL réussi:', result[0][0].test);
  })
  .catch(err => {
    console.error('❌ Erreur connexion MySQL (Knex) :', err.message);
    process.exit(1);
  });

// ✅ INJECTION DE KNEX DANS TOUTES LES ROUTES
app.use((req, res, next) => {
  req.knex = knex;
  next();
});

// ✅ LOGGING DES REQUÊTES
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// ✅ ROUTES
app.use('/signup', require('./routes/signup'));
app.use('/signin', require('./routes/signin'));
app.use('/user', require('./routes/user'));
app.use('/stats', require('./routes/stats'));
app.use('/users', require('./routes/users'));

// ✅ ROUTE DE SANTÉ
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// ✅ ROUTE RACINE
app.get('/', (req, res) => {
  res.json({ 
    message: 'B2B VoIP API Server', 
    version: '1.0.0',
    endpoints: ['/signup', '/signin', '/user', '/health']
  });
});

// ✅ GESTION DES ERREURS GLOBALES
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Erreur serveur interne' 
  });
});

// ✅ GESTION DES ROUTES NON TROUVÉES
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: `Route ${req.method} ${req.path} non trouvée` 
  });
});

// ✅ DÉMARRAGE DU SERVEUR
app.listen(port, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${port}`);
  console.log(`📁 Images accessibles sur http://localhost:${port}/uploads/`);
  console.log(`💾 Base de données: ${process.env.DB_NAME || 'B2BNet_db'}@${process.env.DB_HOST || 'localhost'}`);
});

// ✅ GESTION PROPRE DE L'ARRÊT
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  knex.destroy().then(() => {
    console.log('✅ Connexion MySQL (Knex) fermée');
    process.exit(0);
  });
});

module.exports = app;