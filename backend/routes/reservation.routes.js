const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const audit = require('../middlewares/audit.middleware');

const {
  createReservation,
  getMyReservations,
  cancelReservation
} = require('../controllers/reservation.controller');

// ======================
// CREATE RESERVATION (CLIENT)
// ======================
router.post(
  '/',
  authenticateToken,
  authorizeRoles('CLIENT'),
  audit('CREATE_RESERVATION', 'RESERVATION'),
  createReservation
);

// ======================
// GET MY RESERVATIONS (CLIENT)
// ======================
router.get(
  '/my',
  authenticateToken,
  authorizeRoles('CLIENT'),
  getMyReservations
);

// ======================
// CANCEL RESERVATION (CLIENT)
// ======================
router.put(
  '/:id/cancel',
  authenticateToken,
  authorizeRoles('CLIENT'),
  audit('CANCEL_RESERVATION', 'RESERVATION'),
  cancelReservation
);

module.exports = router;
