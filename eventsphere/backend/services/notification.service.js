const { getConnection } = require('../config/db');

// ======================
// CREATE NOTIFICATION
// ======================
async function createNotification({
  user_id,
  title,
  message,
  type = null,
  related_event_id = null
}) {
  let connection;

  try {
    connection = await getConnection();

    await connection.execute(
      `
      INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        related_event_id
      )
      VALUES (
        :user_id,
        :title,
        :message,
        :type,
        :related_event_id
      )
      `,
      {
        user_id,
        title,
        message,
        type,
        related_event_id
      },
      { autoCommit: true }
    );

  } catch (error) {
    console.error('Notification error:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = {
  createNotification
};
