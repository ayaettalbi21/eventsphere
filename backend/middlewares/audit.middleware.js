const { logAudit } = require('../services/audit.service');

function audit(action, entity_type) {
  return async (req, res, next) => {
    res.on('finish', async () => {
      if (!req.user) return;
      if (res.statusCode >= 400) return;

      const entity_id =
        req.params.id ||
        req.body.event_id ||
        req.body.user_id ||
        null;

      await logAudit({
        user_id: req.user.id,
        action,
        entity_type,
        entity_id,
        description: `${action} on ${entity_type}`
      });
    });

    next();
  };
}

module.exports = audit;
