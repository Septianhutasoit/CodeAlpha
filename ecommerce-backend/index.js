// 1. Import library yang dibutuhkan
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./src/config/db');

// --- TAMBAHAN UNTUK UPLOAD ---
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());
// Middleware agar folder 'uploads' bisa diakses secara publik lewat browser
app.use('/uploads', express.static('uploads'));

// --- KONFIGURASI STORAGE MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir); // Buat folder jika belum ada
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Nama file: waktu-namaasli.ext
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// --- MIDDLEWARE PROTEKSI ---
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: "Akses ditolak, token hilang!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token tidak valid!" });
    }
};

// --- ENDPOINT AUTH ---

// REGISTER
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExist.rows.length > 0) return res.status(400).json({ message: "Email sudah digunakan!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, 'user']
        );
        res.status(201).json({ message: "Registrasi Berhasil!", user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

// LOGIN
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) return res.status(401).json({ message: "Email tidak ditemukan!" });

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Password salah!" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});


// --- ENDPOINT PRODUK ---

// Get All Products
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
        // Tambahkan URL lengkap untuk image_url agar React bisa menampilkan gambar
        const products = result.rows.map(p => ({
            ...p,
            image_url: p.image_url ? `http://localhost:3000${p.image_url}` : null
        }));
        res.json(products);
    } catch (err) {
        console.error("Error Get Products:", err.message);
        res.status(500).json({ message: "Gagal mengambil data produk" });
    }
});

// Add Product (DIPERBAIKI DENGAN MULTER)
app.post('/api/products', verifyToken, upload.single('image'), async (req, res) => {
    // Multer mengisi req.body dan req.file
    const { name, price, stock, description } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Hanya admin yang boleh tambah produk!" });
    }

    try {
        // Ambil path file yang disimpan oleh Multer
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const newProduct = await pool.query(
            "INSERT INTO products (name, price, stock, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, price, stock, description, imageUrl]
        );
        res.status(201).json(newProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Gagal menambah produk" });
    }
});

// Update Product
app.put('/api/products/:id', verifyToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, price, stock, description } = req.body;

    try {
        let imageUrl;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const query = imageUrl
            ? "UPDATE products SET name=$1, price=$2, stock=$3, description=$4, image_url=$5 WHERE id=$6"
            : "UPDATE products SET name=$1, price=$2, stock=$3, description=$4 WHERE id=$5";

        const values = imageUrl
            ? [name, price, stock, description, imageUrl, id]
            : [name, price, stock, description, id];

        await pool.query(query, values);
        res.json({ message: "Produk diperbarui" });
    } catch (err) {
        res.status(500).json({ message: "Gagal update produk" });
    }
});

// Delete Product
app.delete('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM products WHERE id = $1", [id]);
        res.json({ message: "Produk berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal menghapus produk" });
    }
});

// Cart
app.post('/api/cart', async (req, res) => {
    // 1. LIHAT DI TERMINAL VS CODE: Apakah data ini muncul?
    console.log("Data diterima dari frontend:", req.body);

    const { product_id, quantity } = req.body;

    // Cek jika product_id kosong
    if (!product_id) {
        return res.status(400).json({ message: "ID Produk kosong!" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO cart (product_id, quantity) VALUES ($1, $2) RETURNING *",
            [product_id, quantity || 1]
        );
        res.json(result.rows[0]);
    } catch (err) {
        // 2. LIHAT DI TERMINAL: Error database apa yang muncul?
        console.error("❌ ERROR DATABASE:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- TAMBAHKAN INI DI BACKEND (index.js) ---

// Get All Cart Items (UNTUK MENGHITUNG JUMLAH & MENAMPILKAN DI HALAMAN CART)
app.get('/api/cart', async (req, res) => {
    try {
        // Kita join dengan tabel products agar dapat nama dan harga jika perlu
        const result = await pool.query(
            `SELECT cart.id, products.name, products.price, products.image_url, cart.quantity, cart.product_id 
             FROM cart 
             JOIN products ON cart.product_id = products.id`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Gagal mengambil data keranjang" });
    }
});

// Hapus satu item dari keranjang
app.delete('/api/cart/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM cart WHERE id = $1", [id]);
        res.json({ message: "Item berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal menghapus item" });
    }
});

//orders
// --- ENDPOINT ORDERAN UNTUK ADMIN ---

// 1. Ambil semua daftar orderan (Untuk menu "Orderan" di Admin)
app.get('/api/orders', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Gagal mengambil data orderan" });
    }
});

// 2. Update status orderan (Misal: dari 'pending' jadi 'dikirim')
app.put('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
        res.json({ message: "Status orderan berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ message: "Gagal update status" });
    }
});

// --- ENDPOINT CHECKOUT UNTUK USER ---
// Ini yang dipanggil User saat menekan tombol "Bayar/Checkout"
app.post('/api/checkout', async (req, res) => {
    const { customer_name, total_price, items } = req.body;
    try {
        const newOrder = await pool.query(
            "INSERT INTO orders (customer_name, items, total_price) VALUES ($1, $2, $3) RETURNING *",
            [customer_name, JSON.stringify(items), total_price]
        );

        // Opsional: Kosongkan keranjang setelah checkout
        await pool.query("DELETE FROM cart");

        res.json(newOrder.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Checkout gagal" });
    }
});

// --- ENDPOINT PELANGGAN (USERS) ---

// Get All Users (Hanya Admin yang bisa akses)
app.get('/api/users', verifyToken, async (req, res) => {
    // Keamanan: Cek apakah yang mengakses adalah admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses ditolak! Hanya admin yang bisa melihat data ini." });
    }

    try {
        // Mengambil data id, nama, email, role, dan tanggal dibuat (created_at)
        // PENTING: Jangan ambil password!
        const result = await pool.query(
            "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error Get Users:", err.message);
        res.status(500).json({ message: "Gagal mengambil data pelanggan" });
    }
});

// 5. Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});