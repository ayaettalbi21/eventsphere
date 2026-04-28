const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/auth.middleware");
const paymentController = require("../controllers/payment.controller");

// Create payment
router.post("/create", authenticateToken, paymentController.createPayment);

// Confirm payment
router.post("/confirm", authenticateToken, paymentController.confirmPayment);

// My payments
router.get("/my", authenticateToken, paymentController.getMyPayments);

// ✅ Download invoice PDF
router.get("/:id/invoice", authenticateToken, paymentController.downloadInvoice);

// Check payment for event
router.get("/event/:eventId", authenticateToken, paymentController.getPaymentByEvent);

module.exports = router;
