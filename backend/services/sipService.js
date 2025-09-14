const crypto = require('crypto');
const mysql = require('mysql2/promise');

class SipService {
  constructor() {
    // Connexion à la DB Kamailio sur le serveur distant
    this.kamailioDb = mysql.createPool({
      host: process.env.KAMAILIO_DB_HOST || '203.161.56.127', // IP du serveur Kamailio
      port: process.env.KAMAILIO_DB_PORT || 3306,
      user: process.env.KAMAILIO_DB_USER || 'kamailio',
      password: process.env.KAMAILIO_DB_PASSWORD || 'Kama1l!o2025',
      database: process.env.KAMAILIO_DB_NAME || 'kamailio',
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
      // Options de sécurité
      ssl: false, // Mets à true si tu as SSL configuré
      connectTimeout: 30000,
      charset: 'utf8mb4'
    });
  }

  // Créer un compte SIP pour un utilisateur de la plateforme
  async createSipAccount(userId, email) {
    try {
      // Générer des identifiants SIP uniques
      const sipUsername = `user_${userId}`; // ou utiliser l'email
      const sipPassword = crypto.randomBytes(16).toString('hex');
      const domain = process.env.SIP_DOMAIN || '203.161.56.127';
      
      // Calculer les hash pour Kamailio
      const ha1 = this.generateHa1(sipUsername, domain, sipPassword);
      const ha1b = ha1; // Même valeur pour ha1b dans ce cas
      
      // Insérer dans la table subscriber de Kamailio
      await this.kamailioDb.execute(
        'INSERT INTO subscriber (username, domain, password, ha1, ha1b, email_address) VALUES (?, ?, ?, ?, ?, ?)',
        [sipUsername, domain, sipPassword, ha1, ha1b, email]
      );
      
      console.log(`✅ Compte SIP créé: ${sipUsername}@${domain}`);
      
      return {
        sipUsername,
        sipPassword,
        domain,
        wsServer: process.env.KAMAILIO_WS_URL || 'ws://203.161.56.127:5066'
      };
    } catch (error) {
      console.error('❌ Erreur création compte SIP:', error);
      throw error;
    }
  }
  
  // Calculer le hash MD5 pour l'authentification Kamailio
  generateHa1(username, realm, password) {
    return crypto.createHash('md5')
      .update(`${username}:${realm}:${password}`)
      .digest('hex');
  }
  
  // Récupérer les credentials SIP d'un utilisateur
  async getSipCredentials(userId) {
    try {
      const sipUsername = `user_${userId}`;
      const domain = process.env.SIP_DOMAIN || '203.161.56.127';
      
      const [rows] = await this.kamailioDb.execute(
        'SELECT username, domain, password FROM subscriber WHERE username = ? AND domain = ?',
        [sipUsername, domain]
      );
      
      if (rows.length === 0) {
        throw new Error('Compte SIP non trouvé');
      }
      
      return {
        sipUsername: rows[0].username,
        sipPassword: rows[0].password,
        domain: rows[0].domain,
        wsServer: process.env.KAMAILIO_WS_URL || 'ws://203.161.56.127:5066'
      };
    } catch (error) {
      console.error('❌ Erreur récupération credentials SIP:', error);
      throw error;
    }
  }
  
  // Test de connexion à la DB Kamailio
  async testConnection() {
    try {
      const [rows] = await this.kamailioDb.execute('SELECT COUNT(*) as count FROM subscriber');
      console.log('✅ Connexion Kamailio DB réussie:', rows[0].count, 'utilisateurs SIP');
      return true;
    } catch (error) {
      console.error('❌ Erreur connexion Kamailio DB:', error.message);
      return false;
    }
  }

  // Trouver un utilisateur par email pour les appels
  async findUserByEmail(email) {
    try {
      // ATTENTION: Chercher dans la DB de ta plateforme, pas celle de Kamailio
      // Il faut utiliser une autre connexion pour ta DB principale
      console.log('🔍 Recherche utilisateur:', email);
      
      // Pour l'instant, simulation - tu devras adapter selon ta config
      // Utilise req.knex dans les routes ou une autre connexion DB
      throw new Error('findUserByEmail à adapter avec ta DB principale');
      
    } catch (error) {
      console.error('❌ Erreur recherche utilisateur:', error);
      throw error;
    }
  }
}

module.exports = new SipService();
