const { getConnection } = require('../config/db');

async function logAudit({
  user_id,
  action,
  entity_type,
  entity_id,
  description
}) {
  let connection;

  try {
    connection = await getConnection();

    await connection.execute(
      `
      INSERT INTO audit_logs (
        user_id,
        action,
        entity_type,
        entity_id,
        description
      )
      VALUES (
        :user_id,
        :action,
        :entity_type,
        :entity_id,
        :description
      )
      `,
      {
        user_id,
        action,
        entity_type,
        entity_id,
        description
      },
      { autoCommit: true }
    );

  } catch (error) {
    console.error('Audit error:', error);
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  logAudit
};
