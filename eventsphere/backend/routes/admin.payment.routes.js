const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

const {
  getAllPaymentsAdmin,
  getPaymentsByEventAdmin,
  getPaymentStatsAdmin,
} = require("../controllers/admin.payment.controller");

// ======================
router.use(authenticateToken, authorizeRoles("ADMIN"));

// LISTE GLOBALE
router.get("/payments", getAllPaymentsAdmin);

// PAR ÉVÉNEMENT
router.get("/payments/event/:eventId", getPaymentsByEventAdmin);

// STATS
router.get("/payments/stats", getPaymentStatsAdmin);

module.exports = router;
