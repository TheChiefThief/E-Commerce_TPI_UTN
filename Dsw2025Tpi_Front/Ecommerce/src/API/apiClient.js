import axios from 'axios';

const baseURL = 'http://localhost:5142/api'; // API base URL includes /api prefix to match backend routes
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
