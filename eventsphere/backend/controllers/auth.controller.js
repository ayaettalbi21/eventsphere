const oracledb = require('oracledb');
const jwt = require('jsonwebtoken');

const { getConnection } = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/password');

/* ======================
   REGISTER
====================== */
async function register(req, res) {
  const { first_name, last_name, email, password, phone } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Champs obligatoires manquants'
    });
  }

  let connection;

  try {
    connection = await getConnection();

    const emailCheck = await connection.execute(
      `SELECT id FROM users WHERE email = :email`,
      { email }
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email déjà utilisé'
      });
    }

    const hashedPassword = await hashPassword(password);

    const result = await connection.execute(
      `
      INSERT INTO users (first_name, last_name, email, password, phone)
      VALUES (:first_name, :last_name, :email, :password, :phone)
      RETURNING id INTO :id
      `,
      {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        phone,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    const userId = result.outBinds.id[0];

    await connection.execute(
      `
      INSERT INTO user_roles (user_id, role_id)
      SELECT :user_id, id FROM roles WHERE name = 'CLIENT'
      `,
      { user_id: userId },
      { autoCommit: true }
    );

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  } finally {
    if (connection) await connection.close();
  }
}

/* ======================
   LOGIN
====================== */
async function login(req, res) {
  const { email, password } = req.body;

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.password,
        r.name AS role
      FROM users u
      JOIN user_roles ur ON ur.user_id = u.id
      JOIN roles r ON r.id = ur.role_id
      WHERE u.email = :email
      `,
      { email }
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const user = result.rows[0];
    const isMatch = await comparePassword(password, user.PASSWORD);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user.ID, role: user.ROLE },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.ID,
        first_name: user.FIRST_NAME,
        last_name: user.LAST_NAME,
        email: user.EMAIL,
        role: user.ROLE
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  } finally {
    if (connection) await connection.close();
  }
}

/* ======================
   GET AUTHENTICATED USER
====================== */
async function getMe(req, res) {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        r.name AS role
      FROM users u
      JOIN user_roles ur ON ur.user_id = u.id
      JOIN roles r ON r.id = ur.role_id
      WHERE u.id = :id
      `,
      { id: req.user.id }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false });
    }

    const u = result.rows[0];

    res.json({
      success: true,
      user: {
        id: u.ID,
        first_name: u.FIRST_NAME,
        last_name: u.LAST_NAME,
        email: u.EMAIL,
        role: u.ROLE
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
}

/* ======================
   UPDATE PROFILE
====================== */
async function updateProfile(req, res) {
  const { first_name, last_name } = req.body;
  const userId = req.user.id;

  if (!first_name || !last_name) {
    return res.status(400).json({
      success: false,
      message: "First name and last name are required"
    });
  }

  let connection;

  try {
    connection = await getConnection();

    await connection.execute(
      `
      UPDATE users
      SET first_name = :first_name,
          last_name  = :last_name
      WHERE id = :id
      `,
      { first_name, last_name, id: userId },
      { autoCommit: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating profile"
    });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
