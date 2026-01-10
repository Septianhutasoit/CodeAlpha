import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react"; // Tambahkan useRef & useEffect
import { useCart } from "../context/CartContext";
import { ShoppingBag, Search, User, Instagram, Linkedin, Github, MessageCircle, X, Send } from "lucide-react";

export default function UserLayout() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);

    // --- STATE BARU UNTUK CHAT ---
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Halo! Ada yang bisa kami bantu hari ini?' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const chatEndRef = useRef(null);

    const { cartCount } = useCart();

    // Auto scroll ke bawah saat ada pesan baru
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fungsi Kirim Pesan
    // Tambahkan state loading jika belum ada di dalam function UserLayout
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMsg = inputValue;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInputValue("");
        setIsLoading(true);

        try {
            // PASTIKAN INI KUNCI BARU SETELAH KLIK 'ENABLE' DI GOOGLE CLOUD
            const API_KEY = "AIzaSyBNfUsW4NB3qCWDiopPPbRnL-DQNIcZTFw";

            // Gunakan v1beta dan model gemini-1.5-flash
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: userMsg }]
                    }]
                })
            });

            const data = await response.json();

            // Cek jika error
            if (!response.ok) {
                console.error("Gagal Total:", data);
                throw new Error(data.error?.message || "Server Google Menolak");
            }

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const botResponse = data.candidates[0].content.parts[0].text;
                setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
            }

        } catch (error) {
            console.error("Error Akhir:", error.message);

            // Pesan diagnosa untuk Anda
            let pesan = "Maaf, masih ada kendala teknis.";
            if (error.message.includes("not found")) {
                pesan = "API belum di-ENABLE di Google Cloud Console. Silakan klik Enable dulu.";
            }

            setMessages(prev => [...prev, { role: 'bot', text: pesan }]);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div style={us.layout}>
            {/* MODERN NAVBAR */}
            <nav style={us.navbar}>
                <div style={us.navContainer}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div style={us.logoPlaceholder}>
                            <span style={{ fontWeight: '900', color: '#4f46e5' }}>ECO</span>
                            <span style={{ color: '#0f172a' }}>ALPHA</span>
                        </div>
                    </Link>

                    <div style={us.searchWrapper}>
                        <Search size={18} style={us.searchIconInside} />
                        <input
                            type="text"
                            placeholder="Cari produk favoritmu..."
                            style={us.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={us.navLinks}>
                        <div style={us.navPages}>
                            <Link to="/" style={us.link}>Home</Link>
                            <Link to="/gallery" style={us.link}>Gallery</Link>
                        </div>
                        <div style={us.verticalDivider}></div>
                        <div style={us.actionIcons}>
                            <Link to="/cart" style={us.cartContainer}>
                                <ShoppingBag size={22} color="#1e293b" />
                                {cartCount > 0 && <span style={us.badgeStyle}>{cartCount}</span>}
                            </Link>
                            <Link to="/login" style={us.profileCircle}>
                                <User size={20} color="#1e293b" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ISI KONTEN */}
            <main style={us.content}>
                <Outlet context={[searchTerm]} />
            </main>

            {/* --- FLOATING CHATBOT SECTION --- */}
            <div style={us.chatbotWrapper}>
                {isChatOpen && (
                    <div style={us.chatWindow}>
                        <div style={us.chatHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {/* Gambar Header Sekarang Bulat Sempurna */}
                                <div style={us.headerImgWrapper}>
                                    <img src="/chatbot-icon.png" alt="bot" style={us.botImg} />
                                </div>
                                <span style={{ fontWeight: '700', fontSize: '14px' }}>Eco Alpha Assistant</span>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} style={us.closeBtn}>
                                <X size={18} />
                            </button>
                        </div>

                        <div style={us.chatBody}>
                            {messages.map((msg, index) => (
                                <div key={index} style={msg.role === 'user' ? us.userMsgWrapper : us.botMsgWrapper}>
                                    <div style={msg.role === 'user' ? us.userMessage : us.botMessage}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <div style={us.chatInputArea}>
                            <input
                                type="text"
                                placeholder="Tulis pesan..."
                                style={us.chatInput}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage} style={us.sendBtn}>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                )}

                <button
                    style={us.floatingBtn}
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <img
                        src="/chatbot-icon.png"
                        alt=""
                        style={us.botImg}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML += '<div style="font-size:24px">🤖</div>';
                        }}
                    />
                    <div style={us.onlineStatus}></div>
                </button>
            </div>

            {/* MODERN FOOTER */}
            <footer style={us.footer}>
                <div style={us.footerContainer}>
                    <div style={us.footerInfo}>
                        <div style={us.footerLogo}><span style={{ color: '#4f46e5' }}>ECOMMERCE</span>SHOOP</div>
                        <p style={us.footerDesc}>Kami menghadirkan pengalaman belanja digital yang elegan.</p>
                    </div>
                    <div style={us.footerContact}>
                        <p style={us.contactTitle}>Hubungi & Ikuti Kami</p>
                        <div style={us.socialGroup}>
                            <a href="#" style={us.socialIcon}><MessageCircle size={22} /></a>
                            <a href="#" style={us.socialIcon}><Instagram size={22} /></a>
                            <a href="#" style={us.socialIcon}><Linkedin size={22} /></a>
                            <a href="#" style={us.socialIcon}><Github size={22} /></a>
                        </div>
                    </div>
                </div>
                <div style={us.footerBottom}>
                    <div style={us.footerDivider}></div>
                    <p style={us.copyrightText}>© 2025 Ecommerce Store. Developed with Passion.</p>
                </div>
            </footer>
        </div>
    );
}

const us = {
    // Style bawaan kamu tetap ada...
    layout: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', fontFamily: "'Inter', sans-serif" },
    navbar: { height: '80px', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', alignItems: 'center' },
    navContainer: { width: '90%', maxWidth: '1250px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logoPlaceholder: { fontSize: '22px', fontWeight: 'bold', letterSpacing: '-1px', display: 'flex', gap: '2px' },
    searchWrapper: { position: 'relative', width: '40%', display: 'flex', alignItems: 'center' },
    searchIconInside: { position: 'absolute', left: '16px', color: '#94a3b8' },
    searchInput: { width: '100%', padding: '12px 16px 12px 48px', borderRadius: '14px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', outline: 'none', fontSize: '14px', transition: '0.3s' },
    navLinks: { display: 'flex', alignItems: 'center', gap: '24px' },
    navPages: { display: 'flex', gap: '24px' },
    link: { textDecoration: 'none', color: '#64748b', fontWeight: '600', fontSize: '14px' },
    verticalDivider: { width: '1px', height: '24px', backgroundColor: '#e2e8f0' },
    actionIcons: { display: 'flex', alignItems: 'center', gap: '18px' },
    cartContainer: { position: 'relative', display: 'flex', alignItems: 'center', padding: '8px' },
    badgeStyle: { position: 'absolute', top: '2px', right: '2px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid #fff' },
    profileCircle: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#f1f5f9', textDecoration: 'none', border: '1px solid #e2e8f0' },
    content: { flex: 1 },

    // --- PERBAIKAN STYLE CHATBOT ---
    chatbotWrapper: { position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' },

    floatingBtn: {
        width: '65px', height: '65px', borderRadius: '50%', backgroundColor: '#fff', border: 'none',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)', cursor: 'pointer', position: 'relative',
        transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden' // Agar gambar bot tetap bulat
    },

    headerImgWrapper: {
        width: '35px', height: '35px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#fff'
    },

    botImg: {
        width: '100%', height: '100%', objectFit: 'cover'
    },

    onlineStatus: {
        position: 'absolute', bottom: '5px', right: '5px', width: '12px', height: '12px',
        backgroundColor: '#22c55e', borderRadius: '50%', border: '2px solid #fff'
    },

    chatWindow: {
        width: '320px', height: '450px', backgroundColor: '#fff', borderRadius: '20px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', border: '1px solid #f1f5f9'
    },

    chatHeader: {
        padding: '15px 20px', backgroundColor: '#4f46e5', color: '#fff',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },

    closeBtn: { background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' },

    chatBody: { flex: 1, padding: '15px', backgroundColor: '#f8fafc', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },

    botMsgWrapper: { display: 'flex', justifyContent: 'flex-start' },
    userMsgWrapper: { display: 'flex', justifyContent: 'flex-end' },

    botMessage: {
        padding: '10px 14px', backgroundColor: '#fff', borderRadius: '15px', borderBottomLeftRadius: '2px',
        fontSize: '13px', color: '#1e293b', maxWidth: '80%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    },

    userMessage: {
        padding: '10px 14px', backgroundColor: '#4f46e5', color: '#fff', borderRadius: '15px',
        borderBottomRightRadius: '2px', fontSize: '13px', maxWidth: '80%'
    },

    chatInputArea: { padding: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' },
    chatInput: { flex: 1, padding: '10px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' },
    sendBtn: { width: '35px', height: '35px', borderRadius: '10px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },

    footer: { backgroundColor: '#fdfdfd', padding: '80px 0 40px 0', borderTop: '1px solid #f1f5f9', marginTop: '60px' },
    footerContainer: { width: '85%', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '40px' },
    footerInfo: { maxWidth: '600px' },
    footerLogo: { fontSize: '24px', fontWeight: '900', marginBottom: '15px' },
    footerDesc: { fontSize: '15px', color: '#64748b', lineHeight: '1.8' },
    footerContact: { display: 'flex', flexDirection: 'column', gap: '20px' },
    contactTitle: { fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px' },
    socialGroup: { display: 'flex', gap: '15px' },
    socialIcon: { width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', color: '#475569', transition: '0.3s', textDecoration: 'none' },
    footerBottom: { marginTop: '50px' },
    footerDivider: { width: '100px', height: '1px', backgroundColor: '#e2e8f0', margin: '0 auto 25px' },
    copyrightText: { fontSize: '13px', color: '#94a3b8' }
};