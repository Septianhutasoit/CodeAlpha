import { Outlet, Link } from "react-router-dom"; // Tambahkan Link di sini
import Sidebar from "../components/Sidebar";
import { Bell, User, Settings, Search, Users } from "lucide-react"; // Tambahkan Users (ikon)

const AdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">

            {/* SIDEBAR - Fixed Width */}
            <aside className="w-72 flex-shrink-0 bg-[#0f172a] hidden md:block shadow-xl">
                {/* Perbaikan Link dan Icon di bawah ini */}
                <div className="p-4 border-b border-slate-800 mb-4">
                    <Link to="/admin/customers" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white transition">
                        <Users className="w-5 h-5" /> {/* Gunakan Users sesuai import lucide-react */}
                        <span>Pelanggan</span>
                    </Link>
                </div>

                <Sidebar />
            </aside>

            {/* ... sisa kode lainnya sama ... */}

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* MODERN TOP HEADER */}
                <header className="h-20 bg-white border-b border-[#f1f5f9] flex items-center justify-between px-8 z-10">
                    {/* Search Bar Simple di Header */}
                    <div className="relative w-96 hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari data pesanan atau produk..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>

                    {/* Admin Actions */}
                    <div className="flex items-center gap-5">
                        {/* Notification Icon */}
                        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200"></div>

                        {/* Admin Profile */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800 leading-tight">Admin CodeAlpha</p>
                                <p className="text-xs text-indigo-600 font-semibold">Store Manager</p>
                            </div>
                            <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENT AREA - Scrollable */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 md:p-10">
                    <div className="max-w-[1400px] mx-auto w-full">
                        {/* Transition wrapper untuk konten */}
                        <div className="animate-in fade-in duration-500">
                            {children ? children : <Outlet />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;