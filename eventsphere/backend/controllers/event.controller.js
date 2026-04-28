const { getConnection } = require('../config/db');

// ======================
// GET ALL EVENTS (CLIENT / VISITOR)
// ======================
async function getAllEvents(req, res) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(`
      SELECT
        e.id,
        e.title,
        e.description,
        e.objective,
        e.location,
        e.start_date,
        e.end_date,
        e.capacity,
        e.reserved_places,
        e.price,                 -- ✅ NEW
        e.price_includes,        -- ✅ NEW
        e.status,
        e.image_url,
        c.name AS category,
        u.first_name || ' ' || u.last_name AS organizer
      FROM events e
      JOIN categories c ON c.id = e.category_id
      JOIN users u ON u.id = e.organizer_id
      WHERE e.status = 'ACTIVE'
      ORDER BY e.start_date
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
      message: 'Erreur récupération événements'
    });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// GET ONE EVENT BY ID (CLIENT / VISITOR)
// ======================
async function getEventById(req, res) {
  const eventId = req.params.id;
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        e.id,
        e.title,
        e.description,
        e.objective,
        e.location,
        e.start_date,
        e.end_date,
        e.capacity,
        e.reserved_places,
        e.price,                 -- ✅ NEW
        e.price_includes,        -- ✅ NEW
        e.status,
        e.image_url,
        c.name AS category,
        u.first_name || ' ' || u.last_name AS organizer
      FROM events e
      JOIN categories c ON c.id = e.category_id
      JOIN users u ON u.id = e.organizer_id
      WHERE e.id = :id
        AND e.status = 'ACTIVE'
      `,
      { id: eventId }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Événement introuvable'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur récupération événement'
    });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  getAllEvents,
  getEventById
};
