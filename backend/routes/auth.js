const express = require('express');
const router = express.Router();

router.post('/signup', (req, res) => {
  console.log('Signup request received:', req.body);
  // Add your signup logic here
  res.status(200).json({ message: 'Signup route working' });
});

router.post('/signin', (req, res) => {
  console.log('Signin request received:', req.body);
  // Add your signin logic here
  res.status(200).json({ message: 'Signin route working' });
});

module.exports = router;
