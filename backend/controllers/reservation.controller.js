const { getConnection } = require('../config/db');
const { createNotification } = require('../services/notification.service');

// ======================
// CREATE RESERVATION
// ======================
async function createReservation(req, res) {
  const userId = req.user.id;
  const { event_id, quantity } = req.body;

  if (!event_id || !quantity || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Données de réservation invalides'
    });
  }

  let connection;

  try {
    connection = await getConnection();

    // 🔒 Vérifier l'événement + verrou
    const eventResult = await connection.execute(
      `
      SELECT capacity, reserved_places, status
      FROM events
      WHERE id = :event_id
      FOR UPDATE NOWAIT
      `,
      { event_id }
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Événement introuvable'
      });
    }

    const event = eventResult.rows[0];

    if (event.STATUS !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Événement non disponible'
      });
    }

    const availablePlaces = event.CAPACITY - event.RESERVED_PLACES;

    if (availablePlaces < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Places insuffisantes'
      });
    }

    // ➕ Créer la réservation
    await connection.execute(
      `
      INSERT INTO reservations (user_id, event_id, quantity)
      VALUES (:user_id, :event_id, :quantity)
      `,
      { user_id: userId, event_id, quantity }
    );

    // ➕ Mettre à jour les places
    await connection.execute(
      `
      UPDATE events
      SET reserved_places = reserved_places + :quantity
      WHERE id = :event_id
      `,
      { quantity, event_id }
    );

    await connection.commit();

    // 🔔 Notification
    await createNotification({
      user_id: userId,
      title: 'Réservation confirmée',
      message: 'Votre réservation a été confirmée avec succès.',
      type: 'RESERVATION',
      related_event_id: event_id
    });

    res.status(201).json({
      success: true,
      message: 'Réservation confirmée'
    });

  } catch (error) {

    // 🔒 Ressource verrouillée
    if (error.errorNum === 54) {
      return res.status(409).json({
        success: false,
        message: 'Réservation en cours de traitement, veuillez réessayer'
      });
    }

    if (connection) await connection.rollback();
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réservation'
    });

  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// GET MY RESERVATIONS
// ======================
async function getMyReservations(req, res) {
  const userId = req.user.id;
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        r.id,
        r.quantity,
        r.status,
        r.created_at,
        e.title,
        e.location,
        e.start_date,
        e.end_date
      FROM reservations r
      JOIN events e ON e.id = r.event_id
      WHERE r.user_id = :user_id
      ORDER BY r.created_at DESC
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
      message: 'Erreur lors de la récupération des réservations'
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// CANCEL RESERVATION
// ======================
async function cancelReservation(req, res) {
  const userId = req.user.id;
  const reservationId = req.params.id;
  let connection;

  try {
    connection = await getConnection();

    // 🔒 Vérifier la réservation + verrou
    const result = await connection.execute(
      `
      SELECT
        r.id,
        r.quantity,
        r.status,
        e.id AS event_id
      FROM reservations r
      JOIN events e ON e.id = r.event_id
      WHERE r.id = :reservation_id
        AND r.user_id = :user_id
      FOR UPDATE NOWAIT
      `,
      { reservation_id: reservationId, user_id: userId }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Réservation introuvable'
      });
    }

    const reservation = result.rows[0];

    if (reservation.STATUS !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Réservation déjà annulée ou expirée'
      });
    }

    // ❌ Annuler la réservation
    await connection.execute(
      `
      UPDATE reservations
      SET status = 'CANCELLED',
          cancelled_at = CURRENT_TIMESTAMP
      WHERE id = :reservation_id
      `,
      { reservation_id: reservationId }
    );

    // ➖ Libérer les places
    await connection.execute(
      `
      UPDATE events
      SET reserved_places = reserved_places - :quantity
      WHERE id = :event_id
      `,
      { quantity: reservation.QUANTITY, event_id: reservation.EVENT_ID }
    );

    await connection.commit();

    // 🔔 Notification
    await createNotification({
      user_id: userId,
      title: 'Réservation annulée',
      message: 'Votre réservation a été annulée avec succès.',
      type: 'CANCEL',
      related_event_id: reservation.EVENT_ID
    });

    res.json({
      success: true,
      message: 'Réservation annulée avec succès'
    });

  } catch (error) {

    // 🔒 Ressource verrouillée
    if (error.errorNum === 54) {
      return res.status(409).json({
        success: false,
        message: 'Réservation en cours de traitement, veuillez réessayer'
      });
    }

    if (connection) await connection.rollback();
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l’annulation'
    });

  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// EXPORTS
// ======================
module.exports = {
  createReservation,
  getMyReservations,
  cancelReservation
};
