import axios from 'axios';

// Determine API base URL
const RAILWAY_BACKEND = 'https://skill-tracking-platform-production.up.railway.app';

let BASE = import.meta.env.VITE_API_BASE;
if (!BASE) {
  if (import.meta.env.DEV) {
    BASE = 'http://localhost:8000';
  } else {
    // Production fallback — Railway backend
    BASE = RAILWAY_BACKEND;
  }
}

const API = axios.create({
    baseURL: `${BASE}/api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Attach auth token to every request EXCEPT public auth endpoints
const PUBLIC_PATHS = [
    '/auth/login/',
    '/auth/register/',
    '/auth/forgot-password/',
    '/auth/reset-password/',
];

API.interceptors.request.use((config) => {
    const isPublic = PUBLIC_PATHS.some((p) => config.url?.includes(p));
    if (!isPublic) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
    }
    // Only set Content-Type to JSON if it's not already multipart (for file uploads)
    if (!config.headers['Content-Type'] || config.headers['Content-Type'] === 'application/json') {
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
    }
    return config;
});

export default API;
