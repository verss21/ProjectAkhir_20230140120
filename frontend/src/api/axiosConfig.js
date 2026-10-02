import axios from 'axios';

const instance = axios.create({
  // Gunakan substring untuk membuang "/api" jika ada pada .env, karena endpoint di frontend sudah menulis "/api/..."
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000',
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