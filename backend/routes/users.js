// PATH: backend/routes/users.js
const express = require('express');
const router = express.Router();

// ⚠️ ajuste le chemin si, chez toi, c'est "../middleware/authMiddleware"
const authenticateToken = require('../middlewares/authMiddleware');

/**
 * GET /users
 * Liste des utilisateurs (protégé par JWT).
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const knex = req.knex;

    const rows = await knex('users')
      .select(
        'id',
        'first_name',
        'last_name',
        'job_title',
        'email',
        'phone',
        'country',
        'language',
        'profile_photo',
        'created_at'
      )
      .orderBy('created_at', 'desc');

    res.json({ success: true, users: rows });
  } catch (err) {
    console.error('❌ /users error:', err);
    res.status(500).json({ success: false, error: 'Failed to load users' });
  }
});

module.exports = router;
