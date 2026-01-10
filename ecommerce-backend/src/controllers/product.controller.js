const pool = require('../config/db')

// GET all products
exports.getProducts = async (req, res) => {
    const result = await pool.query('SELECT * FROM products ORDER BY id DESC')
    res.json(result.rows)
}

// CREATE product
exports.createProduct = async (req, res) => {
    const { name, price, stock } = req.body

    await pool.query(
        'INSERT INTO products (name, price, stock) VALUES ($1, $2, $3)',
        [name, price, stock]
    )

    res.json({ message: 'Product created' })
}

// UPDATE product
exports.updateProduct = async (req, res) => {
    const { id } = req.params
    const { name, price, stock } = req.body

    await pool.query(
        'UPDATE products SET name=$1, price=$2, stock=$3 WHERE id=$4',
        [name, price, stock, id]
    )

    res.json({ message: 'Product updated' })
}

// DELETE product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params

    await pool.query('DELETE FROM products WHERE id=$1', [id])

    res.json({ message: 'Product deleted' })
}
