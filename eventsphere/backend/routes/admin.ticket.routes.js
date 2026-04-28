const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const audit = require('../middlewares/audit.middleware');

const {
  getAllTickets,
  getTicketDetailsAdmin,
  replyToTicket
} = require('../controllers/admin.ticket.controller');

// ======================
// ADMIN ONLY (GLOBAL)
// ======================
router.use(authenticateToken, authorizeRoles('ADMIN'));

// ======================
// VOIR TOUS LES TICKETS
// ======================
router.get('/tickets', getAllTickets);

// ======================
// DÉTAIL D’UN TICKET
// ======================
router.get('/tickets/:id', getTicketDetailsAdmin);

// ======================
// RÉPONDRE À UN TICKET
// ======================
router.post(
  '/tickets/:id/reply',
  audit('REPLY_TICKET', 'TICKET'),
  replyToTicket
);

module.exports = router;
