const mysql = require('mysql2');

// Buat koneksi pool ke MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Username default Workbench biasanya root
    password: 'Raehanarjun07.', // Masukkan password Workbench kamu di sini
    database: 'anilist_db',    // Pastikan database ini sudah dibuat di Workbench
    port: 3309,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Gunakan .promise() agar bisa pakai async/await
module.exports = pool.promise();