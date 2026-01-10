// backend/db.js
require('dotenv').config(); // Pastikan library dotenv sudah terinstall
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("❌ Koneksi DB Gagal:", err.message);
    } else {
        console.log("✅ DB Terkoneksi pada:", res.rows[0].now);
    }
});

module.exports = pool;