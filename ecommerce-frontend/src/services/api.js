import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Sesuaikan dengan URL Backend Anda
});

// Interceptor: Menempelkan token ke setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createTransaction = async (data) => {
    // Sesuaikan URL-nya dengan port backend kamu
    const response = await fetch('http://localhost:5000/api/payment/process-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};  
export default api;