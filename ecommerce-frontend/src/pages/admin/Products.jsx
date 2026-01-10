import { useEffect, useState } from "react";
import AdminLayout from "../../Layouts/AdminLayout";
import { api } from "../../services/api";
import {
    Plus, Edit3, Trash2, Package, Loader2, X,
    Upload, ImageIcon, Search, Filter, MoreVertical,
    AlertCircle, TrendingUp, Box
} from "lucide-react";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState({ name: '', price: '', stock: '', description: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const getProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products');
            const data = Array.isArray(res.data) ? res.data : (res.data.products || []);
            setProducts(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { getProducts(); }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const openModal = (p = null) => {
        if (p) {
            setEditId(p.id);
            setFormData({ name: p.name, price: p.price, stock: p.stock, description: p.description });
            setPreviewUrl(p.image_url);
        } else {
            setEditId(null);
            setFormData({ name: '', price: '', stock: '', description: '' });
            setPreviewUrl(null);
            setSelectedFile(null);
        }
        setShowModal(true);
    };

    // 1. Tambahkan fungsi handleDelete di bawah getProducts
const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
        try {
            await api.delete(`/products/${id}`);
            alert("Produk berhasil dihapus");
            getProducts(); // Refresh data
        } catch (err) {
            console.error(err);
            alert("Gagal menghapus produk: " + (err.response?.data?.message || "Kesalahan sistem"));
        }
    }
};

// 2. Perbaiki fungsi handleSubmit
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const data = new FormData();
        // Gunakan append satu per satu untuk memastikan tipe data benar
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('description', formData.description);
        
        if (selectedFile) {
            data.append('image', selectedFile);
        }

        if (editId) {
            // PERBAIKAN: Gunakan api.put secara langsung
            await api.put(`/products/${editId}`, data);
        } else {
            await api.post('/products', data);
        }

        setShowModal(false);
        setEditId(null);
        setSelectedFile(null); // Reset file setelah submit
        getProducts();
        alert(editId ? "Produk berhasil diubah" : "Produk berhasil ditambah");
    } catch (err) {
        console.error(err.response?.data);
        alert("Gagal menyimpan: " + (err.response?.data?.message || "Terjadi kesalahan sistem."));
    }
};

    // Filter produk berdasarkan search
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
            <div className="p-6 lg:p-10 bg-[#f8fafc] min-h-screen font-sans">
                {/* Header Section */}
                <div className="max-w-7xl mx-auto mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Management Inventory
                            </h2>
                            <p className="text-slate-500 font-medium mt-1">Pantau dan kelola stok produk Anda secara real-time.</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                        >
                            <Plus size={20} strokeWidth={3} />
                            <span>Tambah Produk</span>
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <StatCard title="Total Produk" value={products.length} icon={<Box className="text-blue-600" />} color="bg-blue-50" />
                        <StatCard title="Stok Menipis" value={products.filter(p => p.stock < 5).length} icon={<AlertCircle className="text-rose-600" />} color="bg-rose-50" />
                        <StatCard title="Estimasi Nilai" value={`Rp ${products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()}`} icon={<TrendingUp className="text-emerald-600" />} color="bg-emerald-50" />
                    </div>
                </div>

                {/* Table Section */}
                <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    {/* Table Toolbar */}
                    <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari nama produk..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm font-medium"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Detail Produk</th>
                                    <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Harga Satuan</th>
                                    <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status Stok</th>
                                    <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="mx-auto animate-spin text-indigo-500" /></td></tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr><td colSpan="4" className="py-20 text-center text-slate-400 font-medium">Data tidak ditemukan</td></tr>
                                ) : filteredProducts.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                    {p.image_url ? (
                                                        <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 leading-tight">{p.name}</div>
                                                    <div className="text-xs text-slate-400 mt-1 line-clamp-1">{p.description || 'Tidak ada deskripsi'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-slate-700 text-sm">
                                            Rp {Number(p.price).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.stock < 5 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {p.stock} Tersedia
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center gap-1">
                                                <button onClick={() => openModal(p)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit3 size={18} /></button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL (Glassmorphism Concept) */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
                        <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl relative overflow-hidden transform transition-all">
                            <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editId ? "Ubah Detail Produk" : "Tambah Produk Baru"}</h3>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] p-6 hover:border-indigo-400 transition-all bg-slate-50 group relative overflow-hidden h-48">
                                        {previewUrl ? (
                                            <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center">
                                                <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 inline-block text-indigo-500 group-hover:scale-110 transition-transform">
                                                    <Upload size={24} />
                                                </div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unggah Foto Produk</p>
                                            </div>
                                        )}
                                        <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>

                                    <div className="grid grid-cols-1 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
                                            <input className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-xl outline-none font-bold text-slate-700 transition-all" type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Contoh: MacBook Pro M2" required />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga (IDR)</label>
                                                <input className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-xl outline-none font-black text-indigo-600 transition-all" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jumlah Stok</label>
                                                <input className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-xl outline-none font-bold text-slate-700 transition-all" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Singkat</label>
                                            <textarea className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-xl outline-none font-medium text-slate-600 h-28 resize-none transition-all" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Ceritakan detail produk..." />
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                        {editId ? "Simpan Perubahan" : "Tambahkan ke Inventaris"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
    );
}

// Sub-komponen untuk Statistik
function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>
                {icon}
            </div>
            <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                <p className="text-xl font-black text-slate-800">{value}</p>
            </div>
        </div>
    );
}