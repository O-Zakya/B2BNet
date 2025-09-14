const crypto = require('crypto');
const mysql = require('mysql2/promise');

class SipService {
  constructor() {
    // Connexion à la DB Kamailio
    this.kamailioDb = mysql.createPool({
      host: process.env.KAMAILIO_DB_HOST || 'localhost',
      user: process.env.KAMAILIO_DB_USER || 'kamailio',
      password: process.env.KAMAILIO_DB_PASSWORD || 'Kama1l!o2025',
      database: process.env.KAMAILIO_DB_NAME || 'kamailio'
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
  
  // Trouver un utilisateur par email pour les appels
  async findUserByEmail(email) {
    try {
      // Chercher dans votre table users principale
      const [rows] = await this.kamailioDb.execute(
        'SELECT id, first_name, last_name, email FROM B2BNet_db.users WHERE email = ?',
        [email]
      );
      
      if (rows.length === 0) return null;
      
      const user = rows[0];
      const sipUsername = `user_${user.id}`;
      
      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        sipUsername
      };
    } catch (error) {
      console.error('❌ Erreur recherche utilisateur:', error);
      throw error;
    }
  }
}

module.exports = new SipService();
