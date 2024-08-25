import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',  // Ajusta la base URL a tu backend
});

// Interceptor para incluir el token JWT en todas las solicitudes
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
