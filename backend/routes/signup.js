const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sipService = require('../services/sipService');
const router = express.Router();

// ✅ CRÉER LE DOSSIER UPLOADS S'IL N'EXISTE PAS
const uploadsDir = 'uploads/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Dossier uploads créé');
}

// ✅ CONFIGURATION MULTER AMÉLIORÉE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Générer un nom unique avec timestamp + extension originale
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// ✅ FILTRES ET LIMITES POUR LES IMAGES
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Vérifier que c'est une image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers images sont autorisés'), false);
    }
  }
});

console.log("✅ Route /signup chargée");

// ✅ ROUTE POST CORRIGÉE
router.post('/', upload.single('profilePhoto'), async (req, res) => {
  console.log('📨 Requête reçue sur /signup');
  console.log('📄 Body:', req.body);
  console.log('📸 File:', req.file ? req.file.filename : 'Aucun fichier');

  const {
    firstName,
    lastName,
    jobTitle,
    email,
    phone,
    country,
    language,
    password
  } = req.body;

  // ✅ VALIDATION DES CHAMPS OBLIGATOIRES
  if (!firstName || !lastName || !jobTitle || !email || !phone || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Tous les champs obligatoires doivent être renseignés' 
    });
  }

  // ✅ VALIDATION EMAIL
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Format d\'email invalide' 
    });
  }

  // ✅ VALIDATION MOT DE PASSE
  if (password.length < 8) {
    return res.status(400).json({ 
      success: false, 
      error: 'Le mot de passe doit contenir au moins 8 caractères' 
    });
  }

  try {
    // ✅ VÉRIFIER SI L'UTILISATEUR EXISTE DÉJÀ AVEC KNEX
    const existingUsers = await req.knex('users').select('id').where('email', email);
    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        success: false, 
        error: 'Un compte existe déjà avec cet email' 
      });
    }

    try {
      // ✅ HASH DU MOT DE PASSE
      const saltRounds = 12; // Plus sécurisé que 10
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // ✅ PRÉPARER LES DONNÉES UTILISATEUR
      const newUser = {
        first_name: firstName,
        last_name: lastName,
        job_title: jobTitle,
        email: email.toLowerCase().trim(), // Normaliser l'email
        phone,
        country: country || null,
        language: language || null,
        password: hashedPassword,
        profile_photo: req.file ? req.file.filename : null,
        created_at: new Date(),
        email_verified: false, // Par défaut non vérifié
        phone_verified: false
      };

      console.log('💾 Données à insérer:', { ...newUser, password: '[MASQUÉ]' });

      // ✅ INSERTION EN BASE DE DONNÉES AVEC KNEX
      let insertedId;
      try {
        const result = await req.knex('users').insert(newUser);
        insertedId = result[0];
      } catch (err) {
        console.error('❌ Erreur insertion MySQL:', err.message);
        // ✅ SUPPRIMER L'IMAGE SI L'INSERTION ÉCHOUE
        if (req.file && fs.existsSync(path.join(uploadsDir, req.file.filename))) {
          fs.unlinkSync(path.join(uploadsDir, req.file.filename));
          console.log('🗑️ Image supprimée suite à l\'erreur');
        }
        return res.status(500).json({ 
          success: false, 
          error: 'Erreur lors de la création du compte' 
        });
      }

      console.log('✅ Utilisateur créé avec ID:', insertedId);

      // ✅ CRÉER AUTOMATIQUEMENT LE COMPTE SIP
      try {
        const sipCredentials = await sipService.createSipAccount(insertedId, email);
        console.log('📞 Compte SIP créé:', sipCredentials.sipUsername);
      } catch (sipError) {
        console.error('⚠️ Erreur création compte SIP (utilisateur créé):', sipError.message);
        // L'utilisateur est créé même si SIP échoue
      }

      // ✅ RÉPONSE DE SUCCÈS
      res.status(201).json({ 
        success: true, 
        message: 'Compte créé avec succès !',
        userId: insertedId,
        profilePhoto: req.file ? req.file.filename : null
      });

    } catch (hashError) {
      console.error('❌ Erreur hashage mot de passe:', hashError);
      return res.status(500).json({ 
        success: false, 
        error: 'Erreur lors du traitement du mot de passe' 
      });
    }

  } catch (error) {
    console.error('❌ Erreur générale signup:', error);
    // ✅ NETTOYER LE FICHIER EN CAS D'ERREUR
    if (req.file && fs.existsSync(path.join(uploadsDir, req.file.filename))) {
      fs.unlinkSync(path.join(uploadsDir, req.file.filename));
    }
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur interne' 
    });
  }
});

// ✅ GESTION DES ERREURS MULTER
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'La taille du fichier dépasse 5MB'
      });
    }
  }
  
  if (error.message === 'Seuls les fichiers images sont autorisés') {
    return res.status(400).json({
      success: false,
      error: 'Seuls les fichiers images sont autorisés'
    });
  }
  
  next(error);
});

module.exports = router;