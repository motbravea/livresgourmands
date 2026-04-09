const express = require('express');
const pool = require('../config/db');
const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const router = express.Router();

// GET all ouvrages
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, c.nom AS categorie
      FROM ouvrages o
      LEFT JOIN categories c ON o.categorie_id = c.id
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET one ouvrage
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM ouvrages WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Ouvrage not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE ouvrage
router.post(
  '/',
  verifyToken,
  authorizeRoles('administrateur', 'gestionnaire', 'editeur'),
  async (req, res) => {
    try {
      const {
        titre,
        auteur,
        isbn,
        description,
        prix,
        stock,
        categorie_id
      } = req.body;

      await pool.query(
        `INSERT INTO ouvrages 
        (titre, auteur, isbn, description, prix, stock, categorie_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [titre, auteur, isbn, description, prix, stock, categorie_id]
      );

      res.json({ message: 'Ouvrage created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// UPDATE ouvrage
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('administrateur', 'gestionnaire', 'editeur'),
  async (req, res) => {
    try {
      const {
        titre,
        auteur,
        isbn,
        description,
        prix,
        stock,
        categorie_id
      } = req.body;

      const [result] = await pool.query(
        `UPDATE ouvrages 
        SET titre=?, auteur=?, isbn=?, description=?, prix=?, stock=?, categorie_id=?
        WHERE id=?`,
        [titre, auteur, isbn, description, prix, stock, categorie_id, req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Ouvrage not found' });
      }

      res.json({ message: 'Ouvrage updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// DELETE ouvrage
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('administrateur', 'gestionnaire', 'editeur'),
  async (req, res) => {
    try {
      const [result] = await pool.query(
        'DELETE FROM ouvrages WHERE id = ?',
        [req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Ouvrage not found' });
      }

      res.json({ message: 'Ouvrage deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;