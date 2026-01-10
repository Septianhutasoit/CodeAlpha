import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]); // <-- TAMBAHKAN INI untuk menyimpan detail barang

    const refreshCartCount = async () => {
        try {
            const res = await api.get('/cart');
            // res.data sekarang berisi array objek: [{id, name, price, image_url, quantity}, ...]

            setCartItems(res.data); // Simpan semua detail barang ke state
            setCartCount(res.data.length); // Update jumlah barang
        } catch (err) {
            console.error("Gagal update cart count:", err);
        }
    };

    useEffect(() => {
        refreshCartCount();
    }, []);

    return (
        // Masukkan cartItems ke dalam value agar bisa diakses di halaman Cart
        <CartContext.Provider value={{ cartCount, cartItems, refreshCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart harus digunakan di dalam CartProvider");
    }
    return context;
};