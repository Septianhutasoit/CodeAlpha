require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// --- TAMBAHKAN ROUTE INI ---
app.get("/api/users", async (req, res) => {
    try {
        // Mengambil data id, name, email, dan created_at dari tabel users
        // Pastikan nama tabel Anda adalah 'users' di PostgreSQL
        const customers = await pool.query(
            "SELECT id, name, email, created_at FROM users ORDER BY created_at DESC"
        );
        res.json(customers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error saat mengambil data pelanggan");
    }
});
// ---------------------------

// ROUTE YANG SUDAH ADA
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/payment", require("./routes/payment.routes"));

// Cek koneksi DB
pool.query("SELECT NOW()")
    .then(res => console.log("DB connected:", res.rows[0]))
    .catch(err => {
        console.error("DB error:", err.message);
        process.exit(1);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server jalan di port ${PORT}`);
});