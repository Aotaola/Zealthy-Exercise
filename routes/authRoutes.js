const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');

router.post('/admin/login', loginAdmin);

router.get('/admin', async (req, res) => {
    try {
      const adminId = req.admin.id; 
      const { rows } = await pool.query('SELECT * FROM admin WHERE admin_id = $1' + [adminId]);
      res.json(rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
