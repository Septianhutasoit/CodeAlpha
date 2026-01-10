const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Pastikan path ke db.js benar

// 1. Ambil data keranjang
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT cart.*, products.name, products.price, products.image_url 
            FROM cart 
            JOIN products ON cart.product_id = products.id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Tambah produk ke keranjang
router.post("/", async (req, res) => {
    const { product_id, quantity } = req.body;
    try {
        // Logika: Jika produk sudah ada, tambah quantity. Jika belum, insert baru.
        const check = await pool.query("SELECT * FROM cart WHERE product_id = $1", [product_id]);

        if (check.rows.length > 0) {
            const update = await pool.query(
                "UPDATE cart SET quantity = quantity + $1 WHERE product_id = $2 RETURNING *",
                [quantity || 1, product_id]
            );
            res.json(update.rows[0]);
        } else {
            const insert = await pool.query(
                "INSERT INTO cart (product_id, quantity) VALUES ($1, $2) RETURNING *",
                [product_id, quantity || 1]
            );
            res.json(insert.rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;