import { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
    Package, Clock, CheckCircle, Truck,
    MoreVertical, Search, Filter
} from "lucide-react";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Ambil data orderan dari backend
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Gagal memuat orderan:", err);
        } finally {
            setLoading(false);
        }
    };

    // 2. Fungsi Update Status (Misal: dari Pending ke Dikirim)
    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/orders/${id}`, { status: newStatus });
            fetchOrders(); // Refresh data
        } catch (err) {
            alert("Gagal memperbarui status");
        }
    };

    return (
        <div style={os.wrapper}>
            <header style={os.header}>
                <div>
                    <h1 style={os.title}>Manajemen Pesanan</h1>
                    <p style={os.subtitle}>Pantau dan kelola semua transaksi pelanggan masuk.</p>
                </div>
                <div style={os.headerActions}>
                    <div style={os.searchBox}>
                        <Search size={18} color="#94a3b8" />
                        <input type="text" placeholder="Cari ID atau Nama..." style={os.searchInput} />
                    </div>
                    <button style={os.filterBtn}><Filter size={18} /> Filter</button>
                </div>
            </header>

            <div style={os.tableCard}>
                <table style={os.table}>
                    <thead>
                        <tr style={os.thead}>
                            <th style={os.th}>ID Pesanan</th>
                            <th style={os.th}>Pelanggan</th>
                            <th style={os.th}>Item</th>
                            <th style={os.th}>Total Harga</th>
                            <th style={os.th}>Status</th>
                            <th style={os.th}>Tanggal</th>
                            <th style={os.th}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={os.loading}>Memuat data pesanan...</td></tr>
                        ) : orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id} style={os.tr}>
                                    <td style={os.td}><strong>#{order.id}</strong></td>
                                    <td style={os.td}>{order.customer_name}</td>
                                    <td style={os.td}>
                                        <div style={os.itemDesc}>
                                            {/* Parsing JSON items dari DB */}
                                            {JSON.parse(order.items || "[]").length} Produk
                                        </div>
                                    </td>
                                    <td style={os.td}>
                                        <span style={os.price}>Rp {Number(order.total_price).toLocaleString('id-ID')}</span>
                                    </td>
                                    <td style={os.td}>
                                        <span style={{
                                            ...os.badge,
                                            ...statusColors[order.status] || statusColors.pending
                                        }}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={os.td}>{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                                    <td style={os.td}>
                                        <select
                                            style={os.select}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            value={order.status}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processed">Diproses</option>
                                            <option value="shipped">Dikirim</option>
                                            <option value="completed">Selesai</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" style={os.empty}>Belum ada pesanan masuk.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// STYLING
const statusColors = {
    pending: { backgroundColor: '#fef3c7', color: '#92400e' },
    processed: { backgroundColor: '#e0e7ff', color: '#3730a3' },
    shipped: { backgroundColor: '#f0fdf4', color: '#166534' },
    completed: { backgroundColor: '#f1f5f9', color: '#475569' },
};

const os = {
    wrapper: { padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: 0 },
    subtitle: { color: '#64748b', fontSize: '15px', marginTop: '5px' },
    headerActions: { display: 'flex', gap: '12px' },
    searchBox: { position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 15px' },
    searchInput: { border: 'none', padding: '10px', outline: 'none', fontSize: '14px', width: '200px' },
    filterBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' },

    tableCard: { backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    thead: { backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' },
    th: { padding: '18px 24px', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
    tr: { borderBottom: '1px solid #f8fafc', transition: '0.2s' },
    td: { padding: '18px 24px', fontSize: '14px', color: '#334155' },
    price: { fontWeight: '700', color: '#0f172a' },
    badge: { padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' },
    select: { padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '13px', backgroundColor: '#f8fafc' },
    loading: { padding: '50px', textAlign: 'center', color: '#94a3b8' },
    empty: { padding: '100px', textAlign: 'center', color: '#94a3b8' }
};