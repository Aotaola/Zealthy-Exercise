const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// PASSWORD HASHING
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// VERIFY PASSWORD
const verifyPassword = async (providedPassword, storedHash) => {
  const isMatch = await bcrypt.compare(providedPassword, storedHash);
  return isMatch;
};

// GENERATE JWT TOKEN
const generateToken = (adminId) => {
  const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
};
