const express = require('express');
const pool = require('../config/db');
const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET one category
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE category
router.post(
  '/',
  verifyToken,
  authorizeRoles('administrateur', 'gestionnaire', 'editeur'),
  async (req, res) => {
    try {
      const { nom, description } = req.body;

      await pool.query(
        'INSERT INTO categories (nom, description) VALUES (?, ?)',
        [nom, description]
      );

      res.json({ message: 'Category created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// UPDATE category
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('administrateur', 'gestionnaire', 'editeur'),
  async (req, res) => {
    try {
      const { nom, description } = req.body;

      const [result] = await pool.query(
        'UPDATE categories SET nom = ?, description = ? WHERE id = ?',
        [nom, description, req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json({ message: 'Category updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// DELETE category
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('administrateur', 'gestionnaire', 'editeur'),
  async (req, res) => {
    try {
      const [result] = await pool.query(
        'DELETE FROM categories WHERE id = ?',
        [req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;