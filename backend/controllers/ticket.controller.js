const { getConnection } = require('../config/db');

// ======================
// CREATE TICKET (CLIENT)
// ======================
async function createTicket(req, res) {
  const userId = req.user.id;
  const { subject, type, message } = req.body;

  if (!subject || !type || !message) {
    return res.status(400).json({
      success: false,
      message: 'Champs requis manquants'
    });
  }

  let connection;

  try {
    connection = await getConnection();

    // 1️⃣ Créer le ticket
    const ticketResult = await connection.execute(
      `
      INSERT INTO tickets (user_id, subject, type, status)
      VALUES (:user_id, :subject, :type, 'OPEN')
      RETURNING id INTO :id
      `,
      {
        user_id: userId,
        subject,
        type,
        id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER }
      },
      { autoCommit: false }
    );

    const ticketId = ticketResult.outBinds.id[0];

    // 2️⃣ Message initial
    await connection.execute(
      `
      INSERT INTO ticket_messages (ticket_id, sender_id, message)
      VALUES (:ticket_id, :sender_id, :message)
      `,
      {
        ticket_id: ticketId,
        sender_id: userId,
        message
      }
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Ticket créé avec succès',
      ticket_id: ticketId
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du ticket'
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// GET MY TICKETS (CLIENT)
// ======================
async function getMyTickets(req, res) {
  const userId = req.user.id;
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        id,
        subject,
        type,
        status,
        created_at,
        closed_at
      FROM tickets
      WHERE user_id = :user_id
      ORDER BY created_at DESC
      `,
      { user_id: userId }
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tickets'
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// GET ONE TICKET + MESSAGES
// ======================
async function getTicketDetails(req, res) {
  const userId = req.user.id;
  const ticketId = req.params.id;
  let connection;

  try {
    connection = await getConnection();

    // 1️⃣ Vérifier le ticket
    const ticketResult = await connection.execute(
      `
      SELECT id, subject, type, status, created_at, closed_at
      FROM tickets
      WHERE id = :ticket_id AND user_id = :user_id
      `,
      {
        ticket_id: ticketId,
        user_id: userId
      }
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket introuvable'
      });
    }

    // 2️⃣ Messages
    const messagesResult = await connection.execute(
      `
      SELECT
        tm.id,
        tm.message,
        tm.created_at,
        u.email AS sender
      FROM ticket_messages tm
      JOIN users u ON u.id = tm.sender_id
      WHERE tm.ticket_id = :ticket_id
      ORDER BY tm.created_at ASC
      `,
      { ticket_id: ticketId }
    );

    res.json({
      success: true,
      ticket: ticketResult.rows[0],
      messages: messagesResult.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du ticket'
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// CLOSE TICKET (CLIENT)
// ======================
async function closeTicket(req, res) {
  const userId = req.user.id;
  const ticketId = req.params.id;
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      UPDATE tickets
      SET status = 'RESOLVED',
          closed_at = CURRENT_TIMESTAMP
      WHERE id = :ticket_id
        AND user_id = :user_id
        AND status != 'RESOLVED'
      `,
      {
        ticket_id: ticketId,
        user_id: userId
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ticket déjà fermé ou introuvable'
      });
    }

    res.json({
      success: true,
      message: 'Ticket fermé avec succès'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la fermeture du ticket'
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// EXPORTS
// ======================
module.exports = {
  createTicket,
  getMyTickets,
  getTicketDetails,
  closeTicket
};
