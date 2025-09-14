const express = require('express');
const router = express.Router();

// Route pour initier un appel
router.post('/initiate', async (req, res) => {
  try {
    console.log('📞 Route /api/calls/initiate appelée');
    console.log('📦 Body reçu:', req.body);
    
    const { phoneNumber, email, enableTranslation } = req.body;
    
    if (!phoneNumber && !email) {
      return res.status(400).json({
        success: false,
        error: 'Phone number or email is required'
      });
    }

    const callId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('✅ Appel initié avec ID:', callId);
    
    res.json({
      success: true,
      callId: callId,
      message: 'Call initiated successfully'
    });

  } catch (error) {
    console.error('❌ Error initiating call:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate call'
    });
  }
});

// Route de test
router.get('/test', (req, res) => {
  console.log('✅ Route /api/calls/test appelée');
  res.json({ 
    success: true, 
    message: 'Calls route is working!',
    timestamp: new Date().toISOString()
  });
});

// Route pour obtenir l'historique des appels
router.get('/history', (req, res) => {
  const db = req.db;
  const query = `
    SELECT * FROM call_history 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 20
  `;
  
  db.query(query, [req.user?.id || 1], (err, results) => {
    if (err) {
      console.error('Erreur récupération historique:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    
    res.json({ success: true, calls: results });
  });
});

module.exports = router;