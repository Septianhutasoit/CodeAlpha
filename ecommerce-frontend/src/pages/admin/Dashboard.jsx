import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
    Package, ShoppingCart, DollarSign,
    Plus, FileText, Bell
} from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]); // State untuk pesanan
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Mengambil data Produk dan Pesanan secara bersamaan
                const [resProd, resOrders] = await Promise.all([
                    api.get('/products'),
                    api.get('/orders').catch(() => ({ data: [] })) // Antisipasi jika endpoint orders belum ada
                ]);

                setProducts(Array.isArray(resProd.data) ? resProd.data : []);
                setOrders(Array.isArray(resOrders.data) ? resOrders.data : []);
            } catch (err) {
                console.error("Gagal mengambil data dashboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Perhitungan Logika (Hanya satu kali deklarasi stats)
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const lowStockItems = products.filter(p => p.stock < 10).length;
    const totalAsset = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

    const stats = [
        {
            title: "Total Produk",
            value: loading ? "..." : totalProducts,
            icon: <Package size={24} />,
            trend: "Stok Aktif",
            color: "#6366f1"
        },
        {
            title: "Pesanan Masuk",
            value: loading ? "..." : totalOrders,
            icon: <ShoppingCart size={24} />,
            trend: "Perlu Diproses",
            color: "#10b981"
        },
        {
            title: "Stok Menipis",
            value: loading ? "..." : lowStockItems,
            icon: <Bell size={24} />,
            trend: "Butuh Restock",
            color: "#ef4444"
        },
        {
            title: "Estimasi Aset",
            value: loading ? "..." : `Rp ${(totalAsset / 1000000).toFixed(1)}M`,
            icon: <DollarSign size={24} />,
            trend: "Nilai Inventaris",
            color: "#f59e0b"
        },
    ];

    return (
        <div style={styles.dashboardWrapper}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>Dashboard Overview</h1>
                    <p style={styles.subtitle}>Pantau performa toko dan inventaris Anda secara realtime.</p>
                </div>
                <div style={styles.headerActions}>
                    <button style={styles.secondaryBtn}><FileText size={18} /> Export</button>
                    <button
                        style={styles.primaryBtn}
                        onClick={() => navigate('/admin/products')}
                    >
                        <Plus size={18} /> Kelola Produk
                    </button>
                </div>
            </header>

            <div style={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <div key={index} style={styles.statCard}>
                        <div style={styles.cardHeader}>
                            <div style={{ ...styles.iconBox, backgroundColor: stat.color + '15', color: stat.color }}>
                                {stat.icon}
                            </div>
                            <span style={{ ...styles.trendTag, color: stat.color === "#ef4444" ? "#ef4444" : "#16a34a" }}>
                                {stat.trend}
                            </span>
                        </div>
                        <div style={styles.cardBody}>
                            <span style={styles.statTitle}>{stat.title}</span>
                            <h2 style={styles.statValue}>{stat.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.contentGrid}>
                <div style={styles.mainContentCard}>
                    <h3 style={styles.cardHeading}>Aktivitas Inventaris Terakhir</h3>
                    <div style={styles.activityList}>
                        {loading ? (
                            <p>Sinkronisasi...</p>
                        ) : products.slice(0, 5).map((p) => (
                            <div key={p.id} style={styles.activityItem}>
                                <div style={styles.avatarPlaceholder}>{p.name.charAt(0)}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={styles.actUser}>{p.name}</p>
                                    <p style={styles.actTime}>ID: #{p.id}</p>
                                </div>
                                <span style={styles.actAmount}>Stok: {p.stock}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.sideCard}>
                    <h3 style={styles.cardHeading}>Koneksi Sistem</h3>
                    <div style={styles.statusBox}>
                        <div style={styles.pulseDot}></div>
                        <p>Database Online (PostgreSQL)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    // ... Copy style dari kode lama Anda ...
    dashboardWrapper: { padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    title: { fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: 0 },
    subtitle: { color: '#64748b', fontSize: '15px' },
    headerActions: { display: 'flex', gap: '15px' },
    primaryBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' },
    secondaryBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', fontWeight: '700' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' },
    statCard: { backgroundColor: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
    iconBox: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    trendTag: { fontSize: '11px', fontWeight: '800' },
    statTitle: { fontSize: '12px', color: '#94a3b8', fontWeight: '700' },
    statValue: { fontSize: '28px', fontWeight: '800', margin: '5px 0' },
    contentGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' },
    mainContentCard: { backgroundColor: 'white', padding: '24px', borderRadius: '24px' },
    sideCard: { backgroundColor: 'white', padding: '24px', borderRadius: '24px' },
    cardHeading: { fontSize: '18px', fontWeight: '800', marginBottom: '20px' },
    activityList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    activityItem: { display: 'flex', alignItems: 'center', gap: '15px' },
    avatarPlaceholder: { width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#4f46e5' },
    actUser: { margin: 0, fontWeight: '700', fontSize: '14px' },
    actTime: { margin: 0, fontSize: '12px', color: '#94a3b8' },
    actAmount: { marginLeft: 'auto', backgroundColor: '#f0fdf4', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', color: '#10b981' },
    statusBox: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' },
    pulseDot: { width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%' }
};