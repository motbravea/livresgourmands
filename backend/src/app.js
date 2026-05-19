const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const testRoutes = require('./routes/test.routes');
const categoriesRoutes = require('./routes/categories.routes');
const ouvragesRoutes = require('./routes/ouvrages.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS test');
    res.json({
      message: 'API livresgourmands running',
      database: 'connected',
      result: rows
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/ouvrages', ouvragesRoutes);

module.exports = app;