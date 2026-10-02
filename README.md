# AniList App (Anime Discovery Platform)

Aplikasi web Fullstack modern untuk mencari, menelusuri, dan menemukan berbagai koleksi anime secara real-time. Dibangun menggunakan arsitektur frontend (React.js) dan backend (Node.js) yang terpisah (De-coupled API) dengan standar keamanan yang mumpuni.

## 🚀 Fitur Utama
- **Real-time Discovery**: Mengambil data anime terbaru, terpopuler, dan pencarian spesifik menggunakan jembatan *Jikan API*.
- **Secure Authentication System**: Dilengkapi sistem Login dan Register menggunakan perlindungan enkripsi `bcrypt` dan autentikasi statis `JSON Web Token (JWT)`.
- **API Key Management**: Pengguna terdaftar bisa melakukan *Generate Access Key* agar dapat membuka fungsionalitas utama menggunakan custom key.
- **Modern UI/UX**: Tampilan *Glassmorphism* dan visual *Bento Grid* responsif untuk antarmuka yang sangat premium.
- **Smart Error Handling**: Notifikasi dan deteksi error pihak ketiga (Jikan API Rate Limit & Timeouts) yang interaktif tanpa membuat halaman menjadi *crash* atau melulu putih.

## 🛠️ Teknologi yang Digunakan

### Frontend (Client)
- **React.js** (Vite)
- **TailwindCSS** (Custom Styling & Glassmorphism)
- **Axios** (API Client & Interceptor)
- **React Router DOM** (Client-side Routing)

### Backend (Server)
- **Node.js** & **Express.js** (REST API)
- **MySQL** & `mysql2` (Relational Database)
- **JWT** (Authentication)
- **Bcrypt.js** (Password Hashing)
- **Dotenv** (Environment Variables Config)

---

## 💻 Instalasi dan Konfigurasi

Pastikan komputer Anda sudah terinstal **Node.js** dan local server database **MySQL** (seperti XAMPP).

### 1. Konfigurasi Backend & Database
1. Buka folder `backend` di terminal.
   ```bash
   cd backend
   npm install
   ```
2. Buat database di phpMyAdmin / MySQL CLI dengan nama `anilist_db` (atau sesuai dengan konfigurasi Anda).
3. Salin/buat file `.env` di dalam folder `backend` dan sesuaikan dengan milik Anda:
   ```env
   PORT=5000
   JWT_SECRET=rahasia_kamu_di_sini
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=password_database_anda
   DB_NAME=anilist_db
   ```
4. Jalankan server Backend:
   ```bash
   npm run dev
   ```

### 2. Konfigurasi Frontend
1. Buka folder `frontend` di terminal baru.
   ```bash
   cd frontend
   npm install
   ```
2. Salin/buat file `.env` di dalam folder `frontend`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Jalankan server Frontend:
   ```bash
   npm run dev
   ```
4. Buka link yang diberikan di terminal (biasanya `http://localhost:5173`) di browser.

---

## 📷 Screenshots
*(Kamu bisa meletakkan/mengganti link gambar di bawah ini dengan screenshot aslimu)*

- **Halaman Discovery (Bento Grid):**  
  ![Discovery Page](./frontend/public/screenshot-discovery.png)

- **Halaman Login & Discovery Locked:**  
  ![Login Page](./frontend/public/screenshot-locked.png)


