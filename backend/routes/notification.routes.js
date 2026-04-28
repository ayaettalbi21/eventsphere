const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const {
  getMyNotifications,
  markAsRead,
  deleteNotification,
  createNotificationAdmin
} = require('../controllers/notification.controller');

// ======================
// CLIENT ROUTES
// ======================

// GET MY NOTIFICATIONS
router.get(
  '/my',
  authenticateToken,
  authorizeRoles('CLIENT'),
  getMyNotifications
);

// MARK NOTIFICATION AS READ
router.put(
  '/:id/read',
  authenticateToken,
  authorizeRoles('CLIENT'),
  markAsRead
);

// DELETE NOTIFICATION
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('CLIENT'),
  deleteNotification
);

// ======================
// ADMIN ROUTE
// ======================

// CREATE NOTIFICATION (ADMIN)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN'),
  createNotificationAdmin
);

module.exports = router;
