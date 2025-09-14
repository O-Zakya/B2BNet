// PATH: backend/routes/stats.js
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const knex = req.knex;

    // Exemple: contacts actifs = nombre total d'utilisateurs
    const [{ c: usersCount }] = await knex('users').count('* as c');

    // Placeholders prêts pour tes futures tables (appels, messages, réunions)
    const totalCallsToday = 0;
    const messagesReceived = 0;
    const totalMeetingsToday = 0;

    res.json({
      totalCallsToday,
      messagesReceived,
      totalMeetingsToday,
      activeContacts: Number(usersCount) || 0,
    });
  } catch (err) {
    console.error('❌ /stats error:', err);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

module.exports = router;
