const express = require('express');
const router = express.Router(); // ✅ UNE SEULE déclaration
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
router.get('/me', authenticateToken, (req, res) => {
  try {
    // Requête pour récupérer toutes les infos utilisateur incluant la photo
    const query = `
      SELECT id, email, first_name, last_name, job_title, phone, country, language, profile_photo, created_at
      FROM users 
      WHERE id = ?
    `;
    
    req.db.query(query, [req.user.id], (err, results) => {
      if (err) {
        console.error('❌ Erreur DB dans /me:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Erreur base de données' 
        });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Utilisateur non trouvé' 
        });
      }
      
      const user = results[0];
      
      console.log('📋 Données utilisateur récupérées:', {
        userId: user.id,
        email: user.email,
        hasPhoto: !!user.profile_photo,
        photoFile: user.profile_photo
      });
      
      // Retourner les données utilisateur avec la photo (conversion snake_case → camelCase pour le frontend)
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
        profilePhoto: user.profile_photo, // Juste le nom du fichier
        createdAt: user.created_at
      });
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
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, jobTitle, phone, country, language } = req.body;
    
    console.log('🔄 Mise à jour profil pour userId:', userId);
    console.log('📝 Nouvelles données:', { firstName, lastName, jobTitle, phone, country, language });
    
    const query = `
      UPDATE users 
      SET first_name = ?, last_name = ?, job_title = ?, phone = ?, country = ?, language = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    req.db.query(query, [firstName, lastName, jobTitle, phone, country, language, userId], (err, results) => {
      if (err) {
        console.error('❌ Erreur mise à jour profil:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Erreur lors de la mise à jour du profil' 
        });
      }
      
      if (results.affectedRows === 0) {
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
router.post('/upload-photo', authenticateToken, upload.single('profilePhoto'), (req, res) => {
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
    const getOldPhotoQuery = 'SELECT profile_photo FROM users WHERE id = ?';
    
    req.db.query(getOldPhotoQuery, [userId], (err, results) => {
      if (err) {
        console.error('❌ Erreur récupération ancienne photo:', err);
      } else if (results.length > 0 && results[0].profile_photo) {
        const oldPhotoPath = path.join(__dirname, '../uploads', results[0].profile_photo);
        
        fs.unlink(oldPhotoPath, (unlinkErr) => {
          if (unlinkErr) {
            console.log('⚠️ Impossible de supprimer l\'ancienne photo:', unlinkErr.message);
          } else {
            console.log('🗑️ Ancienne photo supprimée:', results[0].profile_photo);
          }
        });
      }
    });
    
    // Mettre à jour la base de données avec le nouveau nom de fichier
    const updateQuery = 'UPDATE users SET profile_photo = ?, updated_at = NOW() WHERE id = ?';
    
    req.db.query(updateQuery, [filename, userId], (err, results) => {
      if (err) {
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
      
      if (results.affectedRows === 0) {
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
    });
    
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
router.put('/profile-photo', authenticateToken, (req, res) => {
  try {
    const { profilePhoto } = req.body;
    
    const query = 'UPDATE users SET profile_photo = ?, updated_at = NOW() WHERE id = ?';
    
    req.db.query(query, [profilePhoto, req.user.id], (err, results) => {
      if (err) {
        console.error('❌ Erreur mise à jour photo:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Erreur lors de la mise à jour' 
        });
      }
      
      if (results.affectedRows === 0) {
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