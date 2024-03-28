const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
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
