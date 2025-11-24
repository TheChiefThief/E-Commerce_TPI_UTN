import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL;
const apiClient = axios.create({
baseURL: baseURL,
headers: {
    'Content-Type': 'application/json',
},
});

apiClient.interceptors.request.use(config => 
{
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;
