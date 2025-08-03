const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
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

// ✅ MIDDLEWARES POUR PARSING
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ SERVIR LES FICHIERS STATIQUES (IMAGES)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ CONNEXION MYSQL AMÉLIORÉE
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'b2buser',
  password: process.env.DB_PASSWORD || 'MotDePasseB2B@123',
  database: process.env.DB_NAME || 'b2b_voip_db',
  charset: 'utf8mb4',
  timezone: '+00:00'
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur connexion MySQL :', err.message);
    console.error('🔧 Vérifiez vos paramètres de connexion dans .env');
    process.exit(1);
  } else {
    console.log('✅ Connecté à MySQL');
    
    // ✅ TESTER UNE REQUÊTE SIMPLE
    db.query('SELECT 1 + 1 AS test', (err, results) => {
      if (err) {
        console.error('❌ Erreur test MySQL:', err);
      } else {
        console.log('🔍 Test MySQL réussi:', results[0].test);
      }
    });
  }
});

// ✅ GESTION DES DÉCONNEXIONS MYSQL
db.on('error', (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Reconnexion MySQL...');
    db.connect();
  } else {
    console.error('❌ Erreur MySQL:', err);
  }
});

// ✅ INJECTION DE LA DB DANS TOUTES LES ROUTES
app.use((req, res, next) => {
  req.db = db;
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
  console.log(`💾 Base de données: ${dbConfig.database}@${dbConfig.host}`);
});

// ✅ GESTION PROPRE DE L'ARRÊT
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  db.end(() => {
    console.log('✅ Connexion MySQL fermée');
    process.exit(0);
  });
});

module.exports = app;