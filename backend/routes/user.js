const express = require('express');
const router = express.Router(); // ✅ UNE SEULE déclaration
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sipService = require('../services/sipService');

// ✅ UNE SEULE déclaration du middleware
const authenticateToken = require('../middlewares/authMiddleware');

// ✅ Configuration de multer pour l'upload de photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('📁 Dossier uploads créé:', uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Générer un nom unique pour éviter les conflits
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    console.log('📸 Nouveau fichier photo:', uniqueName);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Vérifier que c'est bien une image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'), false);
    }
  }
});

// ✅ Route sécurisée : /user/me → récupère les infos depuis la DB avec la photo
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const users = await req.knex('users')
      .select('id', 'email', 'first_name', 'last_name', 'job_title', 'phone', 'country', 'language', 'profile_photo', 'created_at')
      .where('id', req.user.id);
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Utilisateur non trouvé' 
      });
    }
    const user = users[0];
    console.log('📋 Données utilisateur récupérées:', {
      userId: user.id,
      email: user.email,
      hasPhoto: !!user.profile_photo,
      photoFile: user.profile_photo
    });
    res.json({
      success: true,
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      jobTitle: user.job_title,
      phone: user.phone,
      country: user.country,
      language: user.language,
      profilePhoto: user.profile_photo,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('❌ Erreur dans /me:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur interne' 
    });
  }
});

// ✅ Route pour mettre à jour le profil utilisateur
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, jobTitle, phone, country, language } = req.body;
    console.log('🔄 Mise à jour profil pour userId:', userId);
    console.log('📝 Nouvelles données:', { firstName, lastName, jobTitle, phone, country, language });
    const result = await req.knex('users')
      .where('id', userId)
      .update({
        first_name: firstName,
        last_name: lastName,
        job_title: jobTitle,
        phone,
        country,
        language,
        updated_at: req.knex.fn.now()
      });
    if (result === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Utilisateur non trouvé' 
      });
    }
    console.log('✅ Profil mis à jour avec succès');
    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: {
        firstName,
        lastName,
        jobTitle,
        phone,
        country,
        language
      }
    });
  } catch (error) {
    console.error('❌ Erreur dans /profile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur interne' 
    });
  }
});

// ✅ Route pour upload de photo de profil
router.post('/upload-photo', authenticateToken, upload.single('profilePhoto'), async (req, res) => {
  try {
    console.log('📸 Début upload photo pour userId:', req.user.id);
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Aucun fichier fourni' 
      });
    }
    const userId = req.user.id;
    const filename = req.file.filename;
    console.log('📁 Fichier uploadé:', {
      filename: filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path
    });
    // Supprimer l'ancienne photo si elle existe
    try {
      const oldUser = await req.knex('users').select('profile_photo').where('id', userId);
      if (oldUser.length > 0 && oldUser[0].profile_photo) {
        const oldPhotoPath = path.join(__dirname, '../uploads', oldUser[0].profile_photo);
        fs.unlink(oldPhotoPath, (unlinkErr) => {
          if (unlinkErr) {
            console.log('⚠️ Impossible de supprimer l\'ancienne photo:', unlinkErr.message);
          } else {
            console.log('🗑️ Ancienne photo supprimée:', oldUser[0].profile_photo);
          }
        });
      }
    } catch (err) {
      console.error('❌ Erreur récupération ancienne photo:', err);
    }
    // Mettre à jour la base de données avec le nouveau nom de fichier
    try {
      const result = await req.knex('users')
        .where('id', userId)
        .update({ profile_photo: filename, updated_at: req.knex.fn.now() });
      if (result === 0) {
        // Supprimer le fichier si l'utilisateur n'existe pas
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error('❌ Erreur suppression fichier:', unlinkErr);
        });
        return res.status(404).json({ 
          success: false, 
          error: 'Utilisateur non trouvé' 
        });
      }
      console.log('✅ Photo de profil mise à jour avec succès');
      res.json({
        success: true,
        message: 'Photo de profil mise à jour avec succès',
        profilePhoto: filename,
        photoUrl: `/uploads/${filename}`
      });
    } catch (err) {
      console.error('❌ Erreur mise à jour photo dans DB:', err);
      // Supprimer le fichier uploadé en cas d'erreur DB
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('❌ Erreur suppression fichier après erreur DB:', unlinkErr);
      });
      return res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de la sauvegarde de la photo' 
      });
    }
  } catch (error) {
    console.error('❌ Erreur dans /upload-photo:', error);
    // Supprimer le fichier en cas d'erreur
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('❌ Erreur suppression fichier après erreur:', unlinkErr);
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur interne' 
    });
  }
});

// ✅ Route pour mettre à jour la photo de profil (via nom de fichier)
router.put('/profile-photo', authenticateToken, async (req, res) => {
  try {
    const { profilePhoto } = req.body;
    const result = await req.knex('users')
      .where('id', req.user.id)
      .update({ profile_photo: profilePhoto, updated_at: req.knex.fn.now() });
    if (result === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Utilisateur non trouvé' 
      });
    }
    console.log('✅ Photo de profil mise à jour:', profilePhoto);
    res.json({
      success: true,
      message: 'Photo de profil mise à jour',
      profilePhoto: profilePhoto
    });
  } catch (error) {
    console.error('❌ Erreur dans /profile-photo:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur interne' 
    });
  }
});

// ✅ Route de test pour vérifier l'accès direct à une image
router.get('/test-photo/:filename', (req, res) => {
  const filename = req.params.filename;
  const fullPath = `http://localhost:5000/uploads/${filename}`;
  
  console.log('🔗 Test d\'accès photo:', fullPath);
  
  res.json({
    success: true,
    filename: filename,
    fullURL: fullPath,
    message: 'Testez cette URL dans votre navigateur'
  });
});

// ✅ Route de test générale
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: '✅ Route /user/test accessible',
    timestamp: new Date().toISOString()
  });
});

// ✅ Gestion des erreurs Multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Fichier trop volumineux (max 5MB)'
      });
    }
  }
  
  if (error.message === 'Seules les images sont autorisées') {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  console.error('❌ Erreur dans user.js:', error);
  res.status(500).json({
    success: false,
    error: 'Erreur lors du traitement de la requête'
  });
});

module.exports = router;