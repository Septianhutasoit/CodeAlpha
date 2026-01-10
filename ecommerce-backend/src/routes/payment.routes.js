const express = require('express');
const router = express.Router();
const midtransClient = require('midtrans-client');
const pool = require('../config/db'); // <--- 1. PASTIKAN IMPORT INI ADA (sesuaikan path)

// Setup Snap
let snap = new midtransClient.Snap({
    isProduction: false, // Tetap false untuk latihan
    // PASTIKAN KEY DI BAWAH INI DIAWALI 'SB-Mid-' jika di mode Sandbox
    serverKey: 'SB-Mid-server-MaraedxgoMuCSq9caNGbvX6L', // Contoh penambahan SB-
    clientKey: 'SB-Mid-client-Wh85LmszfMUA45Sn'
});

router.post("/process-transaction", async (req, res) => {
    try {
        const { total_price, customer_name, items } = req.body;

        if (!total_price || !customer_name) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        const midtransOrderId = `ORD-${Date.now()}`;

        // 1. Simpan ke database
        // Gunakan JSON.stringify jika kolom 'items' bertipe TEXT atau JSON
        await pool.query(
            "INSERT INTO orders (order_id, customer_name, items, total_price, status) VALUES ($1, $2, $3, $4, $5)",
            [midtransOrderId, customer_name, JSON.stringify(items), total_price, 'pending']
        );

        // 2. Minta Token ke Midtrans
        let parameter = {
            "transaction_details": {
                "order_id": midtransOrderId,
                "gross_amount": Math.round(total_price) // Pastikan angka bulat
            },
            "customer_details": {
                "first_name": customer_name
            }
        };

        const transaction = await snap.createTransaction(parameter);

        // 3. Update snap_token ke database
        await pool.query(
            "UPDATE orders SET snap_token = $1 WHERE order_id = $2",
            [transaction.token, midtransOrderId]
        );

        res.json({ token: transaction.token });

    } catch (error) {
        console.error("DETAIL ERROR:", error); // Munculkan di console agar mudah debug
        res.status(500).json({ message: error.message || "Gagal memproses pesanan" });
    }
});

module.exports = router;