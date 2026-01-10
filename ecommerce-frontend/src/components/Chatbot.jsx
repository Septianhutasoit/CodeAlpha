import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Halo! Ada yang bisa saya bantu di Eco Alpha hari ini?' }
    ]);
    const scrollRef = useRef(null);

    // Auto scroll ke pesan terbaru
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        // --- LOGIKA AI (Contoh Menggunakan API) ---
        // Di sini kamu bisa memanggil API backend kamu atau OpenAI secara langsung
        try {
            // Dummy Response (Ganti dengan fetch ke API kamu)
            setTimeout(() => {
                setMessages((prev) => [...prev, {
                    role: 'bot',
                    text: 'Terima kasih pertanyaannya. Fitur AI sedang dikoneksikan ke backend...'
                }]);
            }, 1000);
        } catch (error) {
            console.error("Error AI:", error);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Jendela Chat */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot size={20} />
                            <span className="font-semibold">Eco Alpha Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 rounded-full p-1">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Area Pesan */}
                    <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Chat */}
                    <div className="p-4 border-t bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Tulis pesan..."
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tombol Melayang */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
};

export default Chatbot;