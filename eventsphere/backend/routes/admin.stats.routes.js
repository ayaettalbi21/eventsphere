const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const {
  getEventsCount,
  getClientsCount
} = require('../controllers/admin.stats.controller');

// ======================
// ADMIN STATS ROUTES
// ======================
router.use(authenticateToken, authorizeRoles('ADMIN'));

// GET /admin/stats/events-count
router.get('/events-count', getEventsCount);

// GET /admin/stats/clients-count
router.get('/clients-count', getClientsCount);

module.exports = router;
