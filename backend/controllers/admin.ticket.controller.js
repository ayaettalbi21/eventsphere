const { getConnection } = require('../config/db');

// ======================
// GET ALL TICKETS (ADMIN)
// ======================
async function getAllTickets(req, res) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(`
      SELECT
        t.id,
        t.subject,
        t.type,
        t.status,
        t.created_at,
        u.email AS client_email
      FROM tickets t
      JOIN users u ON u.id = t.user_id
      ORDER BY t.created_at DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur récupération tickets'
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// GET TICKET DETAILS (ADMIN)
// ======================
async function getTicketDetailsAdmin(req, res) {
  const ticketId = req.params.id;
  let connection;

  try {
    connection = await getConnection();

    const ticket = await connection.execute(
      `
      SELECT
        t.id,
        t.subject,
        t.type,
        t.status,
        t.created_at,
        u.email AS client_email
      FROM tickets t
      JOIN users u ON u.id = t.user_id
      WHERE t.id = :id
      `,
      { id: ticketId }
    );

    if (ticket.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket introuvable'
      });
    }

    const messages = await connection.execute(
      `
      SELECT
        tm.id,
        tm.message,
        tm.created_at,
        u.email AS sender
      FROM ticket_messages tm
      JOIN users u ON u.id = tm.sender_id
      WHERE tm.ticket_id = :id
      ORDER BY tm.created_at ASC
      `,
      { id: ticketId }
    );

    res.json({
      success: true,
      ticket: ticket.rows[0],
      messages: messages.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur récupération ticket'
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// REPLY TO TICKET (ADMIN)
// ======================
async function replyToTicket(req, res) {
  const adminId = req.user.id;
  const ticketId = req.params.id;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Message requis'
    });
  }

  let connection;

  try {
    connection = await getConnection();

    await connection.execute(
      `
      INSERT INTO ticket_messages (ticket_id, sender_id, message)
      VALUES (:ticket_id, :sender_id, :message)
      `,
      {
        ticket_id: ticketId,
        sender_id: adminId,
        message
      }
    );

    // Mettre le ticket en cours si ouvert
    await connection.execute(
      `
      UPDATE tickets
      SET status = 'IN_PROGRESS'
      WHERE id = :id AND status = 'OPEN'
      `,
      { id: ticketId }
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Réponse envoyée'
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur réponse ticket'
    });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  getAllTickets,
  getTicketDetailsAdmin,
  replyToTicket
};
