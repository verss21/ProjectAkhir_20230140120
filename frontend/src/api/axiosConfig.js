import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001',
});

// Interceptor untuk pasang token otomatis
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk handle error 500 atau server mati
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      alert("⚠️ Server mati atau koneksi gagal!");
    } else if (error.response.status === 403 || error.response.status === 401) {
      alert("Sesi habis, silakan login ulang.");
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;