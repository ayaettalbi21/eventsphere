const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const audit = require('../middlewares/audit.middleware');

const {
  createTicket,
  getMyTickets,
  getTicketDetails,
  closeTicket
} = require('../controllers/ticket.controller');

// ======================
// CREATE TICKET (CLIENT)
// ======================
router.post(
  '/',
  authenticateToken,
  authorizeRoles('CLIENT'),
  audit('CREATE_TICKET', 'TICKET'),
  createTicket
);

// ======================
// GET MY TICKETS (CLIENT)
// ======================
router.get(
  '/my',
  authenticateToken,
  authorizeRoles('CLIENT'),
  getMyTickets
);

// ======================
// GET ONE TICKET + MESSAGES (CLIENT)
// ======================
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('CLIENT'),
  getTicketDetails
);

// ======================
// CLOSE TICKET (CLIENT)
// ======================
router.put(
  '/:id/close',
  authenticateToken,
  authorizeRoles('CLIENT'),
  audit('CLOSE_TICKET', 'TICKET'),
  closeTicket
);

module.exports = router;
