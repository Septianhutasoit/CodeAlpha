import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CartProvider } from './context/CartContext'
import './index.css' // <--- Pastikan baris ini ada dan jalurnya benar

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider> {/* BUNGKUS DI SINI */}
      <App />
    </CartProvider>
  </React.StrictMode>
)