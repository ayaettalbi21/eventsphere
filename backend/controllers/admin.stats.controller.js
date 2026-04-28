const { getConnection } = require('../config/db');

// ======================
// COUNT EVENTS (ADMIN)
// ======================
async function getEventsCount(req, res) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT COUNT(*) AS total FROM events`
    );

    res.json({
      success: true,
      total_events: result.rows[0].TOTAL
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur récupération statistiques événements'
    });
  } finally {
    if (connection) await connection.close();
  }
}
// ======================
// COUNT CLIENTS (ADMIN)
// ======================
async function getClientsCount(req, res) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT COUNT(*) AS total
      FROM users u
      JOIN user_roles ur ON ur.user_id = u.id
      JOIN roles r ON r.id = ur.role_id
      WHERE r.name = 'CLIENT'
      `
    );

    res.json({
      success: true,
      total_clients: result.rows[0].TOTAL
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur récupération statistiques clients'
    });
  } finally {
    if (connection) await connection.close();
  }
}


module.exports = {
  getEventsCount,
  getClientsCount
};
