import { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, Star, ArrowRight, Loader2, Image as ImageIcon } from "lucide-react";

// IMPORT GAMBAR
import imgGallery1 from "../../assets/shop.jpg";
import imgGallery2 from "../../assets/image2.png";
import imgGallery3 from "../../assets/gallery3.png";
import imgGallery4 from "../../assets/image.png";
import imgHero1 from "../../assets/home1.jpg";
import imgHero2 from "../../assets/home2.jpg";
import imgHero3 from "../../assets/home3.jpg";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingId, setAddingId] = useState(null);
    const [currentHero, setCurrentHero] = useState(0);

    const { refreshCartCount } = useCart();
    const context = useOutletContext();
    const searchTerm = context ? context[0] : "";

    const galleryData = [
        { id: 1, src: imgGallery1, span: "big" },
        { id: 2, src: imgGallery2, span: "small" },
        { id: 3, src: imgGallery3, span: "small" },
        { id: 4, src: imgGallery4, span: "wide" },
    ];

    const heroContent = [
        {
            badge: "Premium Collection",
            title: "Define Your Signature Style.",
            sub: "Koleksi eksklusif yang menggabungkan estetika minimalis dengan fungsionalitas modern.",
            image: imgHero1,
            accent: "#4f46e5"
        },
        {
            badge: "Summer 2024",
            title: "Breeze Into The New Season.",
            sub: "Tetap sejuk dan tampil trendi dengan bahan premium pilihan kami.",
            image: imgHero2,
            accent: "#f97316"
        },
        {
            badge: "Limited Edition",
            title: "Luxury In Every Detail.",
            sub: "Dibuat terbatas untuk Anda yang menghargai kualitas dan detail sempurna.",
            image: imgHero3,
            accent: "#10b981"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHero((prev) => (prev + 1) % heroContent.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroContent.length]);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        api.get('/products')
            .then(res => {
                if (isMounted) {
                    setProducts(Array.isArray(res.data) ? res.data : []);
                    setError(null);
                }
            })
            .catch(() => setError("Gagal memuat produk."))
            .finally(() => { if (isMounted) setLoading(false); });
        return () => { isMounted = false };
    }, []);

    const addToCart = async (product) => {
        setAddingId(product.id);
        try {
            await api.post('/cart', { product_id: product.id, quantity: 1 });
            refreshCartCount();
            alert("Berhasil masuk keranjang!");
        } catch (err) {
            alert("Gagal menambah ke keranjang");
        } finally {
            setAddingId(null);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, products]);

    return (
        <div style={hs.wrapper}>
            <style>{`
                @keyframes zoomEffect {
                    from { transform: scale(1); }
                    to { transform: scale(1.1); }
                }
                @keyframes fadeIn { 
                    from { opacity: 0; transform: translateY(20px); } 
                    to { opacity: 1; transform: translateY(0); } 
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                
                .hero-bg {
                    animation: zoomEffect 8s infinite alternate ease-in-out;
                    transition: opacity 1s ease-in-out;
                }
                .spinner { animation: spin 1s linear infinite; }
                .fade-in { animation: fadeIn 0.8s ease-out forwards; }
                
                .product-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid #f1f5f9; }
                .product-card:hover { transform: translateY(-10px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border-color: #4f46e5; }
                
                .gallery-item { position: relative; overflow: hidden; border-radius: 20px; cursor: pointer; }
                .gallery-item img { transition: 0.6s ease; width: 100%; height: 100%; object-fit: cover; }
                .gallery-item:hover img { transform: scale(1.1); filter: brightness(70%); }
                .gallery-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; color: white; background: rgba(0,0,0,0.2); }
                .gallery-item:hover .gallery-overlay { opacity: 1; }
            `}</style>

            {/* HERO SECTION DENGAN GAMBAR OTOMATIS */}
            <section style={hs.hero}>
                {/* Background Image Layer */}
                <div style={hs.heroBgContainer}>
                    <img
                        key={currentHero}
                        src={heroContent[currentHero].image}
                        alt="Background"
                        className="hero-bg"
                        style={hs.heroBgImage}
                    />
                    <div style={hs.heroOverlay} />
                </div>

                {/* Content Layer */}
                <div style={hs.heroContent} className="fade-in" key={`content-${currentHero}`}>
                    <span style={{ ...hs.heroBadge, border: `1px solid ${heroContent[currentHero].accent}`, color: '#fff' }}>
                        {heroContent[currentHero].badge}
                    </span>
                    <h1 style={hs.heroTitle}>
                        {heroContent[currentHero].title}
                    </h1>
                    <p style={hs.heroSub}>{heroContent[currentHero].sub}</p>
                    <div style={hs.heroActions}>
                        <button style={{ ...hs.btnMain, backgroundColor: heroContent[currentHero].accent }}>
                            Shop Now <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Navigation Dots */}
                <div style={hs.heroDots}>
                    {heroContent.map((_, idx) => (
                        <div key={idx} onClick={() => setCurrentHero(idx)}
                            style={{
                                ...hs.dot,
                                width: currentHero === idx ? '30px' : '10px',
                                backgroundColor: currentHero === idx ? '#fff' : 'rgba(255,255,255,0.4)'
                            }}
                        />
                    ))}
                </div>
            </section>

            <div style={hs.container}>
                {/* GALLERY SECTION */}
                <div style={{ marginBottom: '120px' }}>
                    <div style={hs.sectionHeader}>
                        <div>
                            <h2 style={hs.sectionTitle}>Lifestyle Gallery</h2>
                            <div style={hs.titleUnderline}></div>
                        </div>
                        <p style={{ color: '#64748b', textAlign: 'right', fontSize: '14px' }}>Inspirasi visual koleksi terbaru.</p>
                    </div>

                    <div style={hs.galleryGrid}>
                        {galleryData.map((item) => (
                            <div key={item.id} className="gallery-item"
                                style={{
                                    gridColumn: item.span === "big" || item.span === "wide" ? "span 2" : "span 1",
                                    gridRow: item.span === "big" ? "span 2" : "span 1",
                                    height: '100%', minHeight: '200px'
                                }}
                            >
                                <img src={item.src} alt={`Gallery ${item.id}`} />
                                <div className="gallery-overlay"><ImageIcon size={24} /></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PRODUCT SECTION */}
                <div style={hs.sectionHeader}>
                    <div>
                        <h2 style={hs.sectionTitle}>Featured Collection</h2>
                        <div style={hs.titleUnderline}></div>
                    </div>
                </div>

                {loading ? (
                    <div style={hs.loadingState}><Loader2 className="spinner" size={40} color="#4f46e5" /></div>
                ) : (
                    <div style={hs.productGrid}>
                        {filteredProducts.map(p => (
                            <div key={p.id} style={hs.card} className="product-card">
                                <div style={hs.imageWrapper}>
                                    <img src={p.image_url || "https://via.placeholder.com/400"} alt={p.name} style={hs.productImg} />
                                </div>
                                <div style={hs.cardBody}>
                                    <span style={hs.categoryLabel}>{p.category || "General"}</span>
                                    <h3 style={hs.pName}>{p.name}</h3>
                                    <div style={hs.priceRow}>
                                        <span style={hs.pPrice}>Rp {Number(p.price).toLocaleString('id-ID')}</span>
                                        <button
                                            style={{ ...hs.cartBtn, backgroundColor: addingId === p.id ? '#10b981' : '#0f172a' }}
                                            onClick={() => addToCart(p)}
                                            disabled={addingId === p.id}
                                        >
                                            {addingId === p.id ? <Loader2 size={18} className="spinner" /> : <ShoppingBag size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const hs = {
    wrapper: { backgroundColor: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    container: { width: '92%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' },

    // HERO STYLES
    hero: {
        height: '80vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        marginBottom: '80px',
        borderRadius: '0 0 50px 50px',
    },
    heroBgContainer: { position: 'absolute', inset: 0, zIndex: 0 },
    heroBgImage: { width: '100%', height: '100%', objectFit: 'cover' },
    heroOverlay: {
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
        zIndex: 1
    },
    heroContent: { position: 'relative', zIndex: 2, maxWidth: '800px', color: '#fff', padding: '0 20px' },
    heroBadge: { padding: '6px 18px', borderRadius: '50px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '20px', display: 'inline-block', backdropFilter: 'blur(10px)' },
    heroTitle: { fontSize: '4.5rem', fontWeight: '900', marginBottom: '20px', lineHeight: '1.1', letterSpacing: '-2px' },
    heroSub: { fontSize: '1.2rem', marginBottom: '35px', opacity: 0.9, lineHeight: '1.6' },
    heroActions: { display: 'flex', gap: '15px', justifyContent: 'center' },
    btnMain: { border: 'none', padding: '16px 35px', borderRadius: '50px', color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
    heroDots: { position: 'absolute', bottom: '30px', display: 'flex', gap: '10px', zIndex: 3 },
    dot: { height: '10px', borderRadius: '5px', cursor: 'pointer', transition: '0.4s' },

    // OTHER SECTIONS
    sectionHeader: { marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
    sectionTitle: { fontSize: '2.2rem', fontWeight: '800', color: '#0f172a' },
    titleUnderline: { width: '50px', height: '5px', backgroundColor: '#4f46e5', borderRadius: '10px', marginTop: '8px' },
    galleryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '220px', gap: '20px' },
    productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' },
    card: { backgroundColor: '#fff', borderRadius: '20px', padding: '12px' },
    imageWrapper: { borderRadius: '15px', aspectRatio: '1/1', overflow: 'hidden', backgroundColor: '#f8fafc' },
    productImg: { width: '100%', height: '100%', objectFit: 'cover' },
    cardBody: { padding: '12px 5px' },
    categoryLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' },
    pName: { fontSize: '1.1rem', fontWeight: '700', margin: '5px 0 15px 0', color: '#0f172a' },
    priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    pPrice: { fontSize: '1.2rem', fontWeight: '800' },
    cartBtn: { border: 'none', width: '42px', height: '42px', borderRadius: '10px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    loadingState: { textAlign: 'center', padding: '100px 0' }
};