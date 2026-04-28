const { getConnection } = require("../config/db");

// ======================
// GET ALL PAYMENTS (ADMIN)
// ======================
async function getAllPaymentsAdmin(req, res) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        p.id              AS PAYMENT_ID,
        p.amount          AS AMOUNT,
        p.status          AS STATUS,
        p.created_at      AS CREATED_AT,

        u.id              AS USER_ID,
        u.first_name      AS FIRST_NAME,
        u.last_name       AS LAST_NAME,
        u.email           AS EMAIL,

        e.id              AS EVENT_ID,
        e.title           AS EVENT_TITLE,
        e.status          AS EVENT_STATUS,
        e.capacity        AS CAPACITY,
        e.reserved_places AS RESERVED_PLACES,
        e.start_date      AS START_DATE,
        e.location        AS LOCATION

      FROM payments p
      JOIN users u ON u.id = p.user_id
      JOIN events e ON e.id = p.event_id
      ORDER BY p.created_at DESC
      `
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
      message: "Erreur lors de la rÃ©cupÃ©ration des paiements (admin)",
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// GET PAYMENTS BY EVENT (ADMIN)
// ======================
async function getPaymentsByEventAdmin(req, res) {
  const eventId = Number(req.params.eventId);
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        p.id         AS PAYMENT_ID,
        p.amount     AS AMOUNT,
        p.status     AS STATUS,
        p.created_at AS CREATED_AT,

        u.id         AS USER_ID,
        u.first_name AS FIRST_NAME,
        u.last_name  AS LAST_NAME,
        u.email      AS EMAIL,

        e.id         AS EVENT_ID,
        e.title      AS EVENT_TITLE,
        e.capacity   AS CAPACITY,
        e.reserved_places AS RESERVED_PLACES,
        e.status     AS EVENT_STATUS
      FROM payments p
      JOIN users u ON u.id = p.user_id
      JOIN events e ON e.id = p.event_id
      WHERE p.event_id = :event_id
      ORDER BY p.created_at DESC
      `,
      { event_id: eventId }
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
      message: "Erreur lors de la rÃ©cupÃ©ration des paiements par Ã©vÃ©nement (admin)",
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// PAYMENTS STATS (ADMIN)
// ======================
async function getPaymentStatsAdmin(req, res) {
  let connection;

  try {
    connection = await getConnection();

    // 1) Totaux + revenus
    const totalsResult = await connection.execute(
      `
      SELECT
        COUNT(*) AS TOTAL_PAYMENTS,
        NVL(SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END), 0) AS TOTAL_REVENUE,
        SUM(CASE WHEN status = 'PAID' THEN 1 ELSE 0 END) AS PAID_COUNT,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS PENDING_COUNT,
        SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) AS FAILED_COUNT,
        SUM(CASE WHEN status = 'CANCELED' THEN 1 ELSE 0 END) AS CANCELED_COUNT
      FROM payments
      `
    );

    // 2) Ã‰vÃ©nements complets (calculÃ©, pas stockÃ©)
    const fullEventsResult = await connection.execute(
      `
      SELECT COUNT(*) AS FULL_EVENTS
      FROM events
      WHERE status = 'ACTIVE'
        AND NVL(reserved_places, 0) >= NVL(capacity, 0)
      `
    );

    // 3) Paiements rÃ©cents (petit aperÃ§u dashboard)
    const recentResult = await connection.execute(
      `
      SELECT *
      FROM (
        SELECT
          p.id         AS PAYMENT_ID,
          p.amount     AS AMOUNT,
          p.status     AS STATUS,
          p.created_at AS CREATED_AT,
          u.email      AS EMAIL,
          e.title      AS EVENT_TITLE
        FROM payments p
        JOIN users u ON u.id = p.user_id
        JOIN events e ON e.id = p.event_id
        ORDER BY p.created_at DESC
      )
      WHERE ROWNUM <= 8
      `
    );

    const totals = totalsResult.rows[0];
    const fullEvents = fullEventsResult.rows[0];

    res.json({
      success: true,
      data: {
        totals, // contient TOTAL_PAYMENTS, TOTAL_REVENUE, PAID_COUNT, etc.
        full_events: fullEvents.FULL_EVENTS,
        recent: recentResult.rows,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la rÃ©cupÃ©ration des statistiques paiements (admin)",
    });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  getAllPaymentsAdmin,
  getPaymentsByEventAdmin,
  getPaymentStatsAdmin,
};
