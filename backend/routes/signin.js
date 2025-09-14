const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

console.log("✅ Route /signin chargée");

router.post('/', async (req, res) => {
  console.log('🔐 Tentative de connexion reçue');
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email et mot de passe requis'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Format d\'email invalide'
    });
  }

  try {
    // Utilisation de Knex pour récupérer l'utilisateur
    const users = await req.knex('users')
      .select('id', 'first_name', 'last_name', 'job_title', 'email', 'password', 'profile_photo', 'email_verified', 'created_at')
      .where('email', email.toLowerCase().trim());

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    // ✅ Connexion réussie
    delete user.password;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      'votre_clé_secrète',
      { expiresIn: '2h' }
    );

    // ✅ Mettre à jour updated_at
    req.knex('users')
      .where('id', user.id)
      .update({ updated_at: req.knex.fn.now() })
      .catch(updateErr => {
        console.warn('⚠️ Erreur mise à jour last login:', updateErr.message);
      });

    // ✅ Envoyer une seule réponse ici
    return res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        jobTitle: user.job_title,
        email: user.email,
        profilePhoto: user.profile_photo,
        emailVerified: user.email_verified,
        createdAt: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('❌ Erreur générale signin:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur interne'
    });
  }
});

module.exports = router;
