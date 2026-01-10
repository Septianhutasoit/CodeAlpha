import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Mengasumsikan Anda punya instance axios di sini

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                // Ganti '/users' sesuai dengan endpoint backend Anda
                const response = await api.get('/users');
                setCustomers(response.data);
            } catch (error) {
                console.error("Gagal mengambil data pelanggan", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Manajemen Pelanggan</h1>

            <div className="bg-[#111827] rounded-xl overflow-hidden border border-gray-800">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-[#1f2937] text-gray-400 uppercase text-sm">
                        <tr>
                            <th className="p-4">Nama</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Tanggal Daftar</th>
                            <th className="p-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="p-4 text-center">Memuat data...</td></tr>
                        ) : customers.length === 0 ? (
                            <tr><td colSpan="4" className="p-4 text-center">Belum ada pelanggan mendaftar.</td></tr>
                        ) : (
                            customers.map((user) => (
                                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                                    <td className="p-4 font-medium text-white">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="p-4">
                                        <button className="text-red-400 hover:text-red-300 text-sm font-semibold">
                                            Blokir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;