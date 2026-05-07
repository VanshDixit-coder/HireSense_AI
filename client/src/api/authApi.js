import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hiresense_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hiresense_token');
      window.dispatchEvent(new Event('hiresense:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = 'Something went wrong') {
  return error.response?.data?.message || error.message || fallback;
}

export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data.data),
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data.data),
  me: () => api.get('/auth/me').then((res) => res.data.data),
  updateProfile: (payload) => api.put('/auth/profile', payload).then((res) => res.data.data)
};

export default api;
