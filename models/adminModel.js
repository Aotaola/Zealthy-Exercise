const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


class Admin {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  static async findOne({ username }) {
    const query = 'SELECT * FROM admin WHERE username = $1';
    const values = [username];

    try {
      const result = await pool.query(query, values);
      if (result.rows.length > 0) {
        return new Admin(result.rows[0].id, result.rows[0].username, result.rows[0].password);
      }
      return null;
    } catch (err) {
      console.error('Error querying the database:', err);
      throw err;
    }
  }
}

module.exports = Admin;
