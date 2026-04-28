const oracledb = require('oracledb');

// Sécurité Oracle
oracledb.fetchAsString = [oracledb.CLOB];
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// 🔒 VALIDATION ENV AU DÉMARRAGE
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_CONNECT_STRING) {
  console.error('❌ ERREUR CONFIG ORACLE');
  console.error('DB_USER:', process.env.DB_USER);
  console.error('DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'MISSING');
  console.error('DB_CONNECT_STRING:', process.env.DB_CONNECT_STRING);
  process.exit(1); // ⛔ STOP SERVEUR
}

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING
};

async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

module.exports = {
  getConnection
};
