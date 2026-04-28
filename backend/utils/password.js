const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

// Hasher un mot de passe
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Comparer mot de passe et hash
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword
};
