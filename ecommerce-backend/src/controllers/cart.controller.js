const pool = require("../config/db"); // Pastikan path ke db config benar

const getCart = async (req, res) => {
    try {
        // Ambil data cart beserta detail produknya
        const result = await pool.query(
            "SELECT cart.*, products.name, products.price, products.image_url FROM cart JOIN products ON cart.product_id = products.id"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addToCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    try {
        // Cek apakah produk sudah ada di cart
        const existing = await pool.query("SELECT * FROM cart WHERE product_id = $1", [product_id]);

        if (existing.rows.length > 0) {
            // Jika ada, tambahkan jumlahnya
            const updated = await pool.query(
                "UPDATE cart SET quantity = quantity + $1 WHERE product_id = $2 RETURNING *",
                [quantity, product_id]
            );
            res.json(updated.rows[0]);
        } else {
            // Jika belum ada, masukkan baru
            const result = await pool.query(
                "INSERT INTO cart (product_id, quantity) VALUES ($1, $2) RETURNING *",
                [product_id, quantity]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getCart, addToCart };