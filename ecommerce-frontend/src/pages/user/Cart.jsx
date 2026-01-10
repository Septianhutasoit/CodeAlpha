import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, refreshCartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        refreshCartCount();
    }, []);

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // FUNGSI HAPUS ITEM (Jangan sampai hilang)
    const removeItem = async (id) => {
        if (window.confirm("Hapus item ini dari keranjang?")) {
            try {
                await api.delete(`/cart/${id}`);
                refreshCartCount();
            } catch (err) {
                console.error("Gagal menghapus:", err);
                alert("Gagal menghapus item");
            }
        }
    };

    // FUNGSI CHECKOUT (Sudah dirapikan)
    const handleCheckout = async () => {
        console.log("Tombol diklik!");

        if (cartItems.length === 0) {
            alert("Keranjang kosong!");
            return;
        }

        // Cek apakah script Midtrans sudah terpasang di index.html
        if (!window.snap) {
            alert("Script Midtrans belum siap. Pastikan sudah pasang script snap.js di index.html");
            return;
        }

        try {
            const orderData = {
                order_id: `ORDER-${new Date().getTime()}`,
                total_price: totalPrice,
                customer_details: {
                    first_name: "Customer", // Bisa diambil dari data login jika ada
                    email: "customer@example.com"
                }
            };

            console.log("Mengirim data ke backend...", orderData);

            // Panggil API backend untuk mendapatkan Token
            const response = await api.post('/payment/process-transaction', orderData);
            
            console.log("Respon dari backend:", response.data);
            const { token } = response.data;

            // Munculkan Popup Midtrans
            window.snap.pay(token, {
                onSuccess: (result) => {
                    alert("Pembayaran Berhasil!");
                    console.log(result);
                    refreshCartCount(); // Refresh keranjang setelah sukses
                    navigate('/dashboard');
                },
                onPending: (result) => {
                    alert("Menunggu Pembayaran...");
                    console.log(result);
                },
                onError: (result) => {
                    alert("Pembayaran Gagal!");
                    console.error(result);
                },
                onClose: () => {
                    alert('Anda menutup popup sebelum menyelesaikan pembayaran');
                }
            });

        } catch (error) {
            console.error("Gagal di proses checkout:", error);
            alert("Error: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={styles.pageBackground}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
                        ← Kembali ke Dashboard
                    </button>
                    <h2 style={styles.title}>Keranjang Belanja</h2>
                </div>

                {cartItems.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>🛒</div>
                        <h3 style={styles.emptyTitle}>Keranjangmu Kosong</h3>
                        <p style={styles.emptySubtitle}>Sepertinya kamu belum memilih produk apa pun.</p>
                        <Link to="/dashboard" style={styles.shopNowBtn}>Mulai Belanja Sekarang</Link>
                    </div>
                ) : (
                    <div style={styles.cartContent}>
                        <div style={styles.itemList}>
                            {cartItems.map((item) => (
                                <div key={item.id} style={styles.cartCard}>
                                    <img
                                        src={`http://localhost:3000${item.image_url}`}
                                        alt={item.name}
                                        style={styles.productImg}
                                    />
                                    <div style={styles.productDetails}>
                                        <h4 style={styles.productName}>{item.name}</h4>
                                        <p style={styles.productPrice}>Rp {Number(item.price).toLocaleString()}</p>
                                        <div style={styles.qtyBadge}>
                                            Jumlah: {item.quantity}
                                        </div>
                                    </div>
                                    <div style={styles.actionSection}>
                                        <p style={styles.subtotalText}>Subtotal</p>
                                        <p style={styles.subtotalValue}>Rp {(item.price * item.quantity).toLocaleString()}</p>
                                        <button onClick={() => removeItem(item.id)} style={styles.deleteBtn}>
                                            🗑️ Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={styles.summaryCard}>
                            <h3 style={styles.summaryTitle}>Ringkasan Belanja</h3>
                            <div style={styles.summaryRow}>
                                <span>Total Item</span>
                                <span style={styles.summaryValue}>{cartItems.length} Produk</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span>Total Harga</span>
                                <span style={styles.finalPrice}>Rp {totalPrice.toLocaleString()}</span>
                            </div>
                            <div style={styles.divider} />
                            <button
                                style={styles.checkoutBtn}
                                onClick={handleCheckout}
                            >
                                Beli Sekarang
                            </button>
                            <p style={styles.secureText}>🛡️ Transaksi Aman & Terenkripsi</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MODERN STYLES ---
const styles = {
    pageBackground: { backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px 0' },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#2d3436' },
    header: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' },
    backBtn: { backgroundColor: 'transparent', border: 'none', color: '#636e72', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: '0', textAlign: 'left' },
    title: { fontSize: '32px', fontWeight: '800', margin: 0 },
    cartContent: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '25px', alignItems: 'start' },
    itemList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    cartCard: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #edf2f7' },
    productImg: { width: '110px', height: '110px', objectFit: 'cover', borderRadius: '12px', marginRight: '20px' },
    productDetails: { flex: 1 },
    productName: { fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' },
    productPrice: { fontSize: '15px', color: '#636e72', margin: '0 0 12px 0' },
    qtyBadge: { display: 'inline-block', padding: '4px 12px', backgroundColor: '#f1f2f6', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
    actionSection: { textAlign: 'right', minWidth: '150px' },
    subtotalText: { fontSize: '12px', color: '#b2bec3', margin: 0, textTransform: 'uppercase' },
    subtotalValue: { fontSize: '18px', fontWeight: '800', color: '#00b894', margin: '2px 0 10px 0' },
    deleteBtn: { backgroundColor: '#fff1f0', border: '1px solid #ffa39e', color: '#f5222d', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
    summaryCard: { backgroundColor: '#fff', padding: '28px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #edf2f7', position: 'sticky', top: '20px' },
    summaryTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '20px' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px' },
    summaryValue: { fontWeight: '600' },
    finalPrice: { fontWeight: '800', fontSize: '22px' },
    divider: { height: '1px', backgroundColor: '#edf2f7', margin: '20px 0' },
    checkoutBtn: { width: '100%', backgroundColor: '#0984e3', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
    secureText: { textAlign: 'center', fontSize: '12px', color: '#b2bec3', marginTop: '15px' },
    emptyState: { textAlign: 'center', padding: '80px 40px', backgroundColor: '#fff', borderRadius: '24px' },
    emptyIcon: { fontSize: '80px', marginBottom: '20px' },
    emptyTitle: { fontSize: '24px', fontWeight: '700' },
    emptySubtitle: { color: '#636e72', marginBottom: '30px' },
    shopNowBtn: { display: 'inline-block', padding: '14px 32px', backgroundColor: '#0984e3', color: 'white', textDecoration: 'none', borderRadius: '12px', fontWeight: '700' }
};

export default Cart;