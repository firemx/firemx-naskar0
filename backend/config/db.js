// /backend/config/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load .env explicitly from root
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_NAME:', process.env.DB_NAME);

const pool = mysql.createPool({
  host: 'localhost', // process.env.DB_HOST,
  user: 'naskar01', // process.env.DB_USER,
  password: 'EAT20nvwLLCZ4uCT', // process.env.DB_PASS,
  database: 'naskar', // process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function connectDB() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Connected...');
    connection.release();
  } catch (err) {
    console.error('MySQL Connection Error:', err.message);
    process.exit(1); // Exit on failure
  }
}

//module.exports = connectDB;
module.exports = { connectDB, pool }; 