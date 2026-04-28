const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const audit = require('../middlewares/audit.middleware');
const uploadEventImage = require('../middlewares/uploadEventImage.middleware');

const {
  createEvent,
  getAllEventsAdmin,
  updateEvent,
  cancelEvent
} = require('../controllers/admin.event.controller');

// ======================
router.use(authenticateToken, authorizeRoles('ADMIN'));

// CREATE
router.post(
  '/events',
  uploadEventImage.single('image'),
  audit('CREATE_EVENT', 'EVENT'),
  createEvent
);

// READ
router.get('/events', getAllEventsAdmin);

// UPDATE (IMAGE OPTIONNELLE)
router.put(
  '/events/:id',
  uploadEventImage.single('image'),
  audit('UPDATE_EVENT', 'EVENT'),
  updateEvent
);

// CANCEL
router.put(
  '/events/:id/cancel',
  audit('CANCEL_EVENT', 'EVENT'),
  cancelEvent
);

module.exports = router;
