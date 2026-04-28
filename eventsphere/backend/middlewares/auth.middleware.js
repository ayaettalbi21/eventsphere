const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Format attendu : Bearer TOKEN
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token manquant'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }

    // Injecter l'utilisateur dans la requête
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
