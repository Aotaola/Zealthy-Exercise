require('dotenv').config();
const { verifyPassword, generateToken } = require('../utils/authUtils');
const Admin = require('../models/adminModel'); 

const jwt = require('jsonwebtoken');
// const adminUsername = process.env.Z_ADMIN;
// const adminPassword = process.env.Z_PASSWORD;

// admin login function
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("request started");

    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.log("Admin user not found");
      return res.status(404).json({ message: 'Admin user not found' });
    }

    if (password === admin.password) {
      console.log("Login successful");

      // Generate a token
      const token = jwt.sign({ id: admin.id }, 'your_secret_key', { expiresIn: '24h' });

      return res.status(200).json({ message: 'Login successful'});
    } else {
      console.log("Invalid credentials");
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  loginAdmin,
};
