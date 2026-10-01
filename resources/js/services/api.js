import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

const token = localStorage.getItem('auth_token');
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function setAuthToken(token) {
    if (token) {
        localStorage.setItem('auth_token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('auth_token');
        delete api.defaults.headers.common['Authorization'];
    }
}

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && !window.location.pathname.startsWith('/admin')) {
            setAuthToken(null);
        }
        return Promise.reject(err);
    }
);

export function validationErrors(err) {
    return err.response?.data?.errors ?? {};
}

export function errorMessage(err, fallback = 'Something went wrong. Please try again.') {
    return err.response?.data?.message ?? fallback;
}

export default api;
