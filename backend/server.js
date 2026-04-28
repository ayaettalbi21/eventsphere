require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const chalk = require('chalk').default;
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const app = express();

// ======================
// 🔐 SÉCURITÉ (CORRIGÉE)
// ======================
app.use(
  helmet({
    crossOriginResourcePolicy: false, // ⬅️ ⬅️ ⬅️ TRÈS IMPORTANT
  })
);

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ======================
// MIDDLEWARES
// ======================
app.use(express.json());
app.use(morgan('dev'));

// ======================
// 📸 IMAGES UPLOADÉES (CORRIGÉ)
// ======================
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    },
  })
);

// ======================
// ROUTES
// ======================
app.use('/events', require('./routes/event.routes'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/reservations', require('./routes/reservation.routes'));
app.use('/notifications', require('./routes/notification.routes'));
app.use('/tickets', require('./routes/ticket.routes'));


// 💳 PAYMENTS (AJOUTÉ UNIQUEMENT ICI)
app.use('/payments', require('./routes/payment.routes'));

// ======================
// ADMIN
// ======================
app.use('/admin', require('./routes/admin.ticket.routes'));
app.use('/admin', require('./routes/admin.event.routes'));
app.use('/admin/stats', require('./routes/admin.stats.routes'));
app.use('/admin', require('./routes/admin.payment.routes'));

// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(chalk.green.bold(`✔ Server running on http://localhost:${PORT}`));
});
