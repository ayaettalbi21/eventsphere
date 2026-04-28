const oracledb = require("oracledb");
const PDFDocument = require("pdfkit");
const { getConnection } = require("../config/db");

/* ===============================
   Helpers
================================ */
function money(n) {
  const x = Number(n || 0);
  return `${x.toFixed(2)} EUR`;
}

function pad(num, size = 5) {
  const s = String(num);
  if (s.length >= size) return s;
  return "0".repeat(size - s.length) + s;
}

function safeText(v) {
  return v === null || v === undefined ? "" : String(v);
}

/* ===============================
   CREATE PAYMENT (PENDING)
================================ */
exports.createPayment = async (req, res) => {
  const userId = req.user.id;
  const { event_id, amount } = req.body;

  if (!event_id || amount === undefined || amount === null) {
    return res.status(400).json({
      success: false,
      message: "Données de paiement invalides",
    });
  }

  let connection;

  try {
    connection = await getConnection();

    // 🔎 Vérifier si déjà payé
    const checkResult = await connection.execute(
      `
      SELECT id FROM payments
      WHERE user_id = :user_id
        AND event_id = :event_id
        AND status = 'PAID'
      `,
      { user_id: userId, event_id }
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Événement déjà payé",
      });
    }

    // ➕ Créer paiement PENDING
    const result = await connection.execute(
      `
      INSERT INTO payments (user_id, event_id, amount, status)
      VALUES (:user_id, :event_id, :amount, 'PENDING')
      RETURNING id INTO :id
      `,
      {
        user_id: userId,
        event_id,
        amount: Number(amount),
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );

    res.status(201).json({
      success: true,
      payment_id: result.outBinds.id[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du paiement",
    });
  } finally {
    if (connection) await connection.close();
  }
};

/* ===============================
   CONFIRM PAYMENT
================================ */
exports.confirmPayment = async (req, res) => {
  const userId = req.user.id;
  const { payment_id } = req.body;

  if (!payment_id) {
    return res.status(400).json({
      success: false,
      message: "ID paiement manquant",
    });
  }

  let connection;

  try {
    connection = await getConnection();

    // 🔒 Vérifier paiement + verrou
    const paymentResult = await connection.execute(
      `
      SELECT id, event_id, status
      FROM payments
      WHERE id = :payment_id
        AND user_id = :user_id
      FOR UPDATE NOWAIT
      `,
      { payment_id, user_id: userId }
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Paiement introuvable",
      });
    }

    const payment = paymentResult.rows[0];

    if (payment.STATUS !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Paiement déjà traité",
      });
    }

    // ✅ Marquer comme payé
    await connection.execute(
      `
      UPDATE payments
      SET status = 'PAID'
      WHERE id = :payment_id
      `,
      { payment_id }
    );

    // ➕ CRÉER LA RÉSERVATION (1 paiement = 1 réservation)
    await connection.execute(
      `
      INSERT INTO reservations (user_id, event_id, quantity)
      VALUES (:user_id, :event_id, 1)
      `,
      { user_id: userId, event_id: payment.EVENT_ID }
    );

    // ➕ Mettre à jour les places
    await connection.execute(
      `
      UPDATE events
      SET reserved_places = reserved_places + 1
      WHERE id = :event_id
      `,
      { event_id: payment.EVENT_ID }
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Paiement et réservation confirmés",
    });
  } catch (error) {
    if (error.errorNum === 54) {
      return res.status(409).json({
        success: false,
        message: "Paiement en cours de traitement, veuillez réessayer",
      });
    }

    if (connection) await connection.rollback();
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la confirmation du paiement",
    });
  } finally {
    if (connection) await connection.close();
  }
};

/* ===============================
   GET MY PAYMENTS
================================ */
exports.getMyPayments = async (req, res) => {
  const userId = req.user.id;
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        p.id,
        p.amount,
        p.status,
        p.created_at,
        e.id AS event_id,
        e.title,
        e.start_date,
        e.location
      FROM payments p
      JOIN events e ON e.id = p.event_id
      WHERE p.user_id = :user_id
      ORDER BY p.created_at DESC
      `,
      { user_id: userId }
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des paiements",
    });
  } finally {
    if (connection) await connection.close();
  }
};

/* ===============================
   CHECK PAYMENT FOR EVENT
================================ */
exports.getPaymentByEvent = async (req, res) => {
  const userId = req.user.id;
  const eventId = req.params.eventId;
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT id, status
      FROM payments
      WHERE user_id = :user_id
        AND event_id = :event_id
        AND status = 'PAID'
      `,
      { user_id: userId, event_id: eventId }
    );

    res.json({
      success: true,
      paid: result.rows.length > 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
};

/* ===============================
   DOWNLOAD INVOICE PDF
   GET /payments/:id/invoice
================================ */
exports.downloadInvoice = async (req, res) => {
  const userId = req.user.id;
  const paymentId = Number(req.params.id);

  if (!paymentId) {
    return res.status(400).json({
      success: false,
      message: "Payment id invalid",
    });
  }

  let connection;

  try {
    connection = await getConnection();

    // ✅ Must belong to this user + must be PAID
    const result = await connection.execute(
      `
      SELECT
        p.id AS payment_id,
        p.amount,
        p.status,
        p.created_at,

        u.first_name,
        u.last_name,
        u.email,

        e.id AS event_id,
        e.title AS event_title,
        e.location AS event_location,
        e.start_date AS event_start_date,
        e.end_date AS event_end_date
      FROM payments p
      JOIN users u ON u.id = p.user_id
      JOIN events e ON e.id = p.event_id
      WHERE p.id = :payment_id
        AND p.user_id = :user_id
      `,
      { payment_id: paymentId, user_id: userId }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Paiement introuvable",
      });
    }

    const row = result.rows[0];

    if (row.STATUS !== "PAID") {
      return res.status(403).json({
        success: false,
        message: "Invoice available only for PAID payments",
      });
    }

    const created = new Date(row.CREATED_AT);
    const year = created.getFullYear();
    const invoiceNumber = `INV-${year}-${pad(row.PAYMENT_ID, 5)}`;

    const fileNameSafe = safeText(row.EVENT_TITLE)
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .slice(0, 60);

    const filename = `Invoice_${invoiceNumber}_${fileNameSafe || "EventSphere"}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // =========================
    // PDF DESIGN (Luxury / clean)
    // =========================
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    // Colors
    const brass = "#CF9D7B";
    const black = "#0C1519";
    const gray = "#4B5563";

    // Header
    doc
      .fillColor(black)
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("EventSphere", 50, 50);

    doc
      .fillColor(brass)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("LUXURY EXPERIENCES", 50, 78, { letterSpacing: 1 });

    doc
      .moveTo(50, 105)
      .lineTo(545, 105)
      .lineWidth(1)
      .strokeColor("rgba(207,157,123,0.55)")
      .stroke();

    // Invoice meta (right)
    doc
      .fillColor(black)
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("INVOICE", 400, 55, { align: "right" });

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor(gray)
      .text(`Invoice No: ${invoiceNumber}`, 50, 120, { align: "right" })
      .text(`Issue Date: ${created.toLocaleString("en-GB")}`, 50, 136, { align: "right" });

    // Billing To
    doc
      .fillColor(black)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("BILLING TO", 50, 150);

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(gray)
      .text(`${safeText(row.FIRST_NAME)} ${safeText(row.LAST_NAME)}`.trim(), 50, 168)
      .text(safeText(row.EMAIL), 50, 184);

    // Event details box
    const boxTop = 215;
    doc
      .roundedRect(50, boxTop, 495, 120, 10)
      .lineWidth(1)
      .strokeColor("rgba(255,255,255,0.10)")
      .stroke();

    doc
      .fillColor(black)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("EVENT DETAILS", 65, boxTop + 14);

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(gray)
      .text(`Event: ${safeText(row.EVENT_TITLE)}`, 65, boxTop + 36)
      .text(`Location: ${safeText(row.EVENT_LOCATION)}`, 65, boxTop + 52);

    const start = new Date(row.EVENT_START_DATE);
    const end = new Date(row.EVENT_END_DATE);

    doc
      .text(`Start: ${isNaN(start.getTime()) ? safeText(row.EVENT_START_DATE) : start.toLocaleString("en-GB")}`, 65, boxTop + 68)
      .text(`End: ${isNaN(end.getTime()) ? safeText(row.EVENT_END_DATE) : end.toLocaleString("en-GB")}`, 65, boxTop + 84);

    // Payment Summary
    const payTop = boxTop + 150;

    doc
      .fillColor(black)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("PAYMENT SUMMARY", 50, payTop);

    // Table header
    doc
      .roundedRect(50, payTop + 18, 495, 26, 8)
      .fillOpacity(1)
      .fillColor("rgba(207,157,123,0.14)")
      .fill();

    doc
      .fillColor(black)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Description", 65, payTop + 26)
      .text("Status", 370, payTop + 26, { width: 70, align: "right" })
      .text("Amount", 460, payTop + 26, { width: 70, align: "right" });

    // Table row
    doc
      .fillColor(gray)
      .font("Helvetica")
      .fontSize(10)
      .text("Event reservation payment", 65, payTop + 60);

    doc
      .font("Helvetica-Bold")
      .fillColor(brass)
      .text(safeText(row.STATUS), 370, payTop + 60, { width: 70, align: "right" });

    doc
      .font("Helvetica-Bold")
      .fillColor(black)
      .text(money(row.AMOUNT), 460, payTop + 60, { width: 70, align: "right" });

    // Total box (right)
    const totalBoxTop = payTop + 105;
    doc
      .roundedRect(330, totalBoxTop, 215, 80, 10)
      .lineWidth(1)
      .strokeColor("rgba(255,255,255,0.10)")
      .stroke();

    doc
      .fillColor(gray)
      .font("Helvetica")
      .fontSize(10)
      .text("Total", 350, totalBoxTop + 18);

    doc
      .fillColor(black)
      .font("Helvetica-Bold")
      .fontSize(18)
      .text(money(row.AMOUNT), 350, totalBoxTop + 38);

    // Footer note
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("rgba(255,255,255,0.55)")
      .text(
        "This document confirms a completed transaction for an EventSphere experience. Thank you for choosing refined exclusivity.",
        50,
        760,
        { width: 495, align: "center" }
      );

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la génération de la facture",
    });
  } finally {
    if (connection) await connection.close();
  }
};
