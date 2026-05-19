const express = require('express');
const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Access granted',
    user: req.user
  });
});

router.get('/admin', verifyToken, authorizeRoles('administrateur'), (req, res) => {
  res.json({ message: 'Welcome admin' });
});

module.exports = router;