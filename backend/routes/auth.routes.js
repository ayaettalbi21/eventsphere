const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/auth.middleware');
const {
  register,
  login,
  getMe,
  updateProfile
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);

// ✅ UPDATE PROFILE
router.put('/update-profile', authenticateToken, updateProfile);

module.exports = router;
