const { getConnection } = require('../config/db');

// ======================
// GET MY NOTIFICATIONS (CLIENT)
// ======================
async function getMyNotifications(req, res) {
  const userId = req.user.id;
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        id,
        title,
        message,
        type,
        related_event_id,
        is_read,
        created_at
      FROM notifications
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
      message: 'Erreur lors de la récupération des notifications'
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// MARK NOTIFICATION AS READ (CLIENT)
// ======================
async function markAsRead(req, res) {
  const userId = req.user.id;
  const notificationId = req.params.id;
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      UPDATE notifications
      SET is_read = 1
      WHERE id = :notification_id
        AND user_id = :user_id
      `,
      {
        notification_id: notificationId,
        user_id: userId
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification introuvable'
      });
    }

    res.json({
      success: true,
      message: 'Notification marquée comme lue'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la notification'
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// DELETE NOTIFICATION (CLIENT)
// ======================
async function deleteNotification(req, res) {
  const userId = req.user.id;
  const notificationId = req.params.id;
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      DELETE FROM notifications
      WHERE id = :notification_id
        AND user_id = :user_id
      `,
      {
        notification_id: notificationId,
        user_id: userId
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification introuvable'
      });
    }

    res.json({
      success: true,
      message: 'Notification supprimée avec succès'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la notification'
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// CREATE NOTIFICATION (ADMIN)
// ======================
async function createNotificationAdmin(req, res) {
  const { title, message, type, related_event_id, user_id } = req.body;
  let connection;

  if (!title || !message) {
    return res.status(400).json({
      success: false,
      message: 'Titre et message obligatoires'
    });
  }

  try {
    connection = await getConnection();

    // 🔹 Notification ciblée
    if (user_id) {
      await connection.execute(
        `
        INSERT INTO notifications (
          user_id, title, message, type, related_event_id
        )
        VALUES (
          :user_id, :title, :message, :type, :related_event_id
        )
        `,
        { user_id, title, message, type, related_event_id },
        { autoCommit: true }
      );

      return res.status(201).json({
        success: true,
        message: 'Notification envoyée à l’utilisateur'
      });
    }

    // 🔹 Notification globale (tous les CLIENTS)
    await connection.execute(
      `
      INSERT INTO notifications (user_id, title, message, type, related_event_id)
      SELECT u.id, :title, :message, :type, :related_event_id
      FROM users u
      JOIN user_roles ur ON ur.user_id = u.id
      JOIN roles r ON r.id = ur.role_id
      WHERE r.name = 'CLIENT'
      `,
      { title, message, type, related_event_id },
      { autoCommit: true }
    );

    res.status(201).json({
      success: true,
      message: 'Notification envoyée à tous les clients'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l’envoi de la notification'
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// EXPORTS
// ======================
module.exports = {
  getMyNotifications,
  markAsRead,
  deleteNotification,
  createNotificationAdmin
};
