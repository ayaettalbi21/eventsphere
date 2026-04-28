const oracledb = require("oracledb");
const { getConnection } = require("../config/db");

// ======================
// CREATE EVENT
// ======================
async function createEvent(req, res) {
  const adminId = req.user.id;
  const body = req.body || {};
  const imagePath = req.file ? `/uploads/events/${req.file.filename}` : null;

  if (
    !body.title ||
    !body.description ||
    !body.category_id ||
    !body.start_date ||
    !body.end_date ||
    !body.capacity ||
    body.price === undefined ||
    body.price === null ||
    body.price === ""
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      INSERT INTO events (
        title,
        description,
        objective,
        category_id,
        organizer_id,
        location,
        start_date,
        end_date,
        capacity,
        price,
        price_includes,
        image_url,
        status
      )
      VALUES (
        :title,
        :description,
        :objective,
        :category_id,
        :organizer_id,
        :location,
        TO_TIMESTAMP(:start_date, 'YYYY-MM-DD"T"HH24:MI'),
        TO_TIMESTAMP(:end_date, 'YYYY-MM-DD"T"HH24:MI'),
        :capacity,
        :price,
        :price_includes,
        :image_url,
        'ACTIVE'
      )
      RETURNING id INTO :id
      `,
      {
        title: body.title,
        description: body.description,
        objective: body.objective || null,
        category_id: Number(body.category_id),
        organizer_id: adminId,
        location: body.location || null,
        start_date: body.start_date,
        end_date: body.end_date,
        capacity: Number(body.capacity),
        price: Number(body.price),

        // ✅ NEW
        price_includes: body.price_includes || null,

        image_url: imagePath,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );

    res.status(201).json({
      success: true,
      event_id: result.outBinds.id[0],
      image_url: imagePath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// GET ALL EVENTS (ADMIN)
// ======================
async function getAllEventsAdmin(req, res) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM events ORDER BY created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// UPDATE EVENT
// ======================
async function updateEvent(req, res) {
  const eventId = req.params.id;
  const body = req.body || {};
  const imagePath = req.file ? `/uploads/events/${req.file.filename}` : null;

  let connection;
  try {
    connection = await getConnection();

    await connection.execute(
      `
      UPDATE events SET
        title = NVL(:title, title),
        description = NVL(:description, description),
        objective = NVL(:objective, objective),
        category_id = NVL(:category_id, category_id),
        location = NVL(:location, location),
        start_date = NVL(TO_TIMESTAMP(:start_date, 'YYYY-MM-DD"T"HH24:MI'), start_date),
        end_date = NVL(TO_TIMESTAMP(:end_date, 'YYYY-MM-DD"T"HH24:MI'), end_date),
        capacity = NVL(:capacity, capacity),
        price = NVL(:price, price),
        price_includes = NVL(:price_includes, price_includes),
        image_url = NVL(:image_url, image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
      `,
      {
        id: Number(eventId),
        title: body.title || null,
        description: body.description || null,
        objective: body.objective || null,
        category_id:
          body.category_id !== undefined && body.category_id !== ""
            ? Number(body.category_id)
            : null,
        location: body.location || null,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        capacity:
          body.capacity !== undefined && body.capacity !== ""
            ? Number(body.capacity)
            : null,
        price:
          body.price !== undefined && body.price !== ""
            ? Number(body.price)
            : null,

        // ✅ NEW
        price_includes: body.price_includes || null,

        image_url: imagePath,
      },
      { autoCommit: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
}

// ======================
// CANCEL EVENT
// ======================
async function cancelEvent(req, res) {
  const eventId = req.params.id;
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `UPDATE events SET status='CANCELLED' WHERE id=:id`,
      { id: Number(eventId) },
      { autoCommit: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  createEvent,
  getAllEventsAdmin,
  updateEvent,
  cancelEvent,
};
