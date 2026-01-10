import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Mail, Lock, User, ArrowRight, Github, Linkedin } from "lucide-react";

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const endpoint = isRegister ? "/register" : "/login";
            const payload = isRegister ? { name, email, password } : { email, password };
            const res = await api.post(endpoint, payload);

            if (!isRegister) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.user.role);
                navigate(res.data.user.role === "admin" ? "/admin/dashboard" : "/");
            } else {
                alert("Pendaftaran berhasil! Silakan login.");
                setIsRegister(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Terjadi kesalahan, coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={ls.page}>
            {/* Animasi & Efek Global */}
            <style>{`
             @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
                @keyframes slideIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-float { animation: float 4s ease-in-out infinite; }
                .animate-slide { animation: slideIn 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
                .input-focus:focus-within { 
                    border-color: #6366f1 !important; 
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15) !important;
                    background: #fff !important;
                }
                .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 24px -6px rgba(79, 70, 229, 0.4); }
                .social-btn:hover { background: #f8fafc !important; border-color: #cbd5e1 !important; transform: scale(1.05); }
            `}</style>

            <div style={ls.container} className="animate-slide">
                {/* BAGIAN KIRI: BRANDING & MASKOT */}
                <div style={ls.brandSection}>
                    <div style={ls.brandOverlay}></div>
                    <div style={ls.brandContent}>
                        <div className="animate-float" style={ls.logoWrapper}>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/3081/3081840.png"
                                alt="Shop Mascot"
                                style={ls.logoImage}
                            />
                        </div>

                        <h2 style={ls.brandQuote}>Modern Shopping <br /> <span style={{ color: '#a5b4fc' }}>Made Simple.</span></h2>
                        <p style={ls.brandSub}>Bergabunglah untuk mendapatkan koleksi digital terbaik dengan pengalaman yang mulus.</p>

                        <div style={ls.featureList}>
                            <div style={ls.featureItem}>
                                <div style={ls.featureCheck}>✓</div>
                                <span>Premium Quality Products</span>
                            </div>
                            <div style={ls.featureItem}>
                                <div style={ls.featureCheck}>✓</div>
                                <span>Secure Cloud Syncing</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BAGIAN KANAN: FORM */}
                <div style={ls.formSection}>
                    <div style={ls.formWrapper}>
                        <div style={ls.headerGroup}>
                            <h2 style={ls.title}>{isRegister ? "Join Us" : "Welcome"}</h2>
                            <p style={ls.subtitle}>Akses akun premium Anda sekarang</p>
                        </div>

                        {error && <div style={ls.errorBadge}>{error}</div>}

                        <form onSubmit={handleSubmit} style={ls.form}>
                            {isRegister && (
                                <div style={ls.inputGroup} className="input-focus">
                                    <User size={18} style={ls.inputIcon} />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        style={ls.input}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div style={ls.inputGroup} className="input-focus">
                                <Mail size={18} style={ls.inputIcon} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    style={ls.input}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={ls.inputGroup} className="input-focus">
                                <Lock size={18} style={ls.inputIcon} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    style={ls.input}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {!isRegister && (
                                <div style={{ textAlign: 'right', marginBottom: '25px' }}>
                                    <span style={ls.forgotPw}>Forgot password?</span>
                                </div>
                            )}

                            <button type="submit" style={ls.loginBtn} className="btn-primary" disabled={loading}>
                                {loading ? "Syncing..." : (isRegister ? "Create Account" : "Sign In")}
                                <ArrowRight size={18} />
                            </button>
                        </form>

                        {/* PEMBATAS */}
                        <div style={ls.divider}>
                            <div style={ls.dividerLine}></div>
                            <span style={ls.dividerText}>OR CONTINUE WITH</span>
                            <div style={ls.dividerLine}></div>
                        </div>

                        {/* TOMBOL SOSIAL (SUDAH DI DALAM STRUKTUR YANG BENAR) */}
                        <div style={ls.socialGroup}>
                            <button
                                type="button"
                                style={ls.socialBtn}
                                className="social-btn"
                                onClick={() => window.open("https://github.com/Septianhutasoit", "_blank")}
                            >
                                <Github size={20} color="#333" />
                                <span style={{ fontWeight: '600', fontSize: '13px' }}>GitHub</span>
                            </button>
                            <button
                                type="button"
                                style={ls.socialBtn}
                                className="social-btn"
                                onClick={() => window.open("https://www.linkedin.com/in/septian-a-hutasoit/", "_blank")}
                            >
                                <Linkedin size={20} color="#0077b5" />
                                <span style={{ fontWeight: '600', fontSize: '13px' }}>LinkedIn</span>
                            </button>
                        </div>

                        <p style={ls.footerText}>
                            {isRegister ? "Have an account?" : "New here?"}
                            <span
                                style={ls.toggleBtn}
                                onClick={() => { setIsRegister(!isRegister); setError(""); }}
                            >
                                {isRegister ? " Sign In" : " Create Free Account"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ls = {
    page: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        padding: '20px',
        // GRADIENT YANG HIDUP
        background: 'linear-gradient(-45deg, #04345d, #0a4a7a, #021b2e, #1e293b)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite', // Gerakan sangat halus selama 15 detik
        overflow: 'hidden',
        position: 'relative'
    },
    container: {
        display: 'flex', width: '100%', maxWidth: '1000px', minHeight: '650px',
        backgroundColor: '#fff', borderRadius: '40px', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.12)', overflow: 'hidden'
    },
    // BRAND SECTION
    brandSection: {
        flex: 1, position: 'relative',
        backgroundColor: '#0f172a',
        backgroundImage: 'url("https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800")',
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', alignItems: 'center', padding: '50px'
    },
    brandOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)', backdropFilter: 'blur(4px)' },
    brandContent: { position: 'relative', zIndex: 2, color: '#fff', width: '100%' },
    logoWrapper: {
        width: '80px', height: '80px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.2)'
    },
    logoImage: { width: '50px', height: '50px', objectFit: 'contain' },
    brandQuote: { fontSize: '38px', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px', letterSpacing: '-1px' },
    brandSub: { fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '40px', maxWidth: '300px' },
    featureList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    featureItem: { fontSize: '14px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '12px' },
    featureCheck: { width: '22px', height: '22px', backgroundColor: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' },

    // FORM SECTION
    formSection: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px' },
    formWrapper: { width: '100%', maxWidth: '360px' },
    headerGroup: { marginBottom: '30px', textAlign: 'center' },
    title: { fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: '#64748b' },
    errorBadge: {
        backgroundColor: '#fff1f2', color: '#e11d48', padding: '12px', borderRadius: '12px',
        marginBottom: '20px', fontSize: '13px', border: '1px solid #ffe4e6', fontWeight: '600', textAlign: 'center'
    },
    inputGroup: {
        position: 'relative', marginBottom: '14px', display: 'flex', alignItems: 'center',
        border: '1.5px solid #f1f5f9', borderRadius: '16px', transition: '0.3s', backgroundColor: '#f8fafc'
    },
    inputIcon: { marginLeft: '16px', color: '#94a3b8' },
    input: {
        width: '100%', padding: '15px', border: 'none', background: 'none',
        outline: 'none', fontSize: '14px', color: '#1e293b', fontWeight: '500'
    },
    forgotPw: { fontSize: '13px', color: '#6366f1', fontWeight: '700', cursor: 'pointer' },
    loginBtn: {
        width: '100%', padding: '16px', backgroundColor: '#4f46e5', color: '#fff',
        border: 'none', borderRadius: '16px', fontWeight: '700', cursor: 'pointer',
        fontSize: '15px', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
    },
    divider: { display: 'flex', alignItems: 'center', margin: '25px 0', gap: '15px' },
    dividerLine: { flex: 1, height: '1px', backgroundColor: '#f1f5f9' },
    dividerText: { fontSize: '10px', color: '#94a3b8', fontWeight: '800', letterSpacing: '1px' },
    socialGroup: { display: 'flex', gap: '12px', marginBottom: '25px' },
    socialBtn: {
        flex: 1, padding: '12px', borderRadius: '16px', border: '1.5px solid #f1f5f9',
        backgroundColor: '#fff', cursor: 'pointer', transition: '0.3s', display: 'flex',
        alignItems: 'center', justifyContent: 'center', gap: '10px'
    },
    footerText: { textAlign: 'center', fontSize: '14px', color: '#64748b' },
    toggleBtn: { color: '#4f46e5', fontWeight: '800', cursor: 'pointer', marginLeft: '5px' }
};