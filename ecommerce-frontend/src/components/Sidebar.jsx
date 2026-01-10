import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    Wrench,
    HelpCircle,
    LogOut
} from "lucide-react";

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    // Data Menu
    const menus = [
        { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Produk", path: "/admin/Products", icon: <Package size={20} /> },
        { name: "Orderan", path: "/admin/orders", icon: <ShoppingCart size={20} />, badge: "New" },

        { name: "Manajemen", section: true }, // Section Header
        { name: "Pelanggan", path: "/admin/customers", icon: <Users size={20} /> }, // Path null = Belum ada fitur

        { name: "Sistem", section: true }, // Section Header
        { name: "Konfigurasi", path: null, icon: <Wrench size={20} /> },
        { name: "Bantuan", path: null, icon: <HelpCircle size={20} /> },
    ];

    const handleLogout = () => {
        // Tambahkan logika hapus token/session di sini jika ada
        if (window.confirm("Apakah Anda yakin ingin keluar?")) {
            navigate("/login");
        }
    };

    return (
        <div style={s.sidebar}>
            {/* Logo Section */}
            <div style={s.logoContainer}>
                <div style={s.logoIcon}>A</div>
                <span style={s.logoText}>Admin<strong>Panel</strong></span>
            </div>

            {/* Profile Brief */}
            <div style={s.profileCard}>
                <div style={s.avatar}>
                    <Users size={18} color="#94a3b8" />
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <p style={s.profileName}>Super Admin</p>
                    <p style={s.profileStatus}>
                        <span style={s.statusDot}></span> Online
                    </p>
                </div>
            </div>

            {/* Navigation Menu */}
            <div style={s.menuScroll}>
                <div style={s.menuList}>
                    {menus.map((m, i) => {
                        // Jika ini adalah Section Title
                        if (m.section) {
                            return <p key={i} style={s.sectionTitle}>{m.name}</p>;
                        }

                        const isActive = location.pathname === m.path;
                        const isDisabled = m.path === null;

                        return (
                            <Link
                                key={i}
                                to={m.path || "#"}
                                onClick={(e) => {
                                    if (isDisabled) {
                                        e.preventDefault(); // Mencegah pindah halaman
                                        alert("Fitur ini sedang dalam pengembangan.");
                                    }
                                }}
                                style={{
                                    ...s.menuItem,
                                    backgroundColor: isActive ? '#4f46e5' : 'transparent',
                                    color: isActive ? '#ffffff' : (isDisabled ? '#475569' : '#94a3b8'),
                                    cursor: isDisabled ? 'default' : 'pointer',
                                    opacity: isDisabled ? 0.6 : 1,
                                }}
                            >
                                <span style={{ ...s.icon, color: isActive ? '#fff' : 'inherit' }}>
                                    {m.icon}
                                </span>
                                <span style={s.menuName}>{m.name}</span>
                                {m.badge && (
                                    <span style={{
                                        ...s.badge,
                                        backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#4f46e5',
                                        color: '#fff'
                                    }}>
                                        {m.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Footer Sidebar (Tombol Keluar) */}
            <div style={s.footer}>
                <button onClick={handleLogout} style={s.logoutBtn}>
                    <LogOut size={18} />
                    <span>Keluar Aplikasi</span>
                </button>
            </div>
        </div>
    );
}

const s = {
    sidebar: {
        width: '260px',
        backgroundColor: '#0f172a',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
        fontFamily: "'Inter', sans-serif"
    },
    logoContainer: {
        padding: '30px 25px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    logoIcon: {
        width: '32px',
        height: '32px',
        backgroundColor: '#4f46e5',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px'
    },
    logoText: {
        color: 'white',
        fontSize: '18px',
        fontWeight: '400',
        letterSpacing: '0.5px'
    },
    profileCard: {
        margin: '0 20px 20px 20px',
        padding: '12px',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid rgba(255,255,255,0.05)'
    },
    avatar: {
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        backgroundColor: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileName: { color: 'white', margin: 0, fontSize: '13px', fontWeight: '600' },
    profileStatus: {
        color: '#94a3b8',
        margin: 0,
        fontSize: '11px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        marginTop: '2px'
    },
    statusDot: {
        width: '6px',
        height: '6px',
        backgroundColor: '#10b981',
        borderRadius: '50%'
    },
    menuScroll: {
        flex: 1,
        overflowY: 'auto',
        padding: '0 15px'
    },
    menuList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    sectionTitle: {
        padding: '25px 12px 10px 12px',
        fontSize: '10px',
        textTransform: 'uppercase',
        color: '#475569',
        fontWeight: '800',
        letterSpacing: '1.5px'
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 14px',
        textDecoration: 'none',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease-in-out',
    },
    icon: { marginRight: '12px', display: 'flex', alignItems: 'center' },
    menuName: { flex: 1 },
    badge: {
        fontSize: '10px',
        padding: '2px 8px',
        borderRadius: '99px',
        fontWeight: '700'
    },
    footer: {
        padding: '20px',
        borderTop: '1px solid rgba(255,255,255,0.05)'
    },
    logoutBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)', // Merah transparan tipis
        border: 'none',
        borderRadius: '10px',
        color: '#f87171',
        cursor: 'pointer',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: '0.3s',
        fontSize: '14px'
    }
};