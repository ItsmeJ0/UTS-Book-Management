// Import modul yang dibutuhkan
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

// Konfigurasi CORS
const corsOptions = {
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'], // Daftar origin yang diizinkan
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(express.json()); // Pastikan ini ada

// Gunakan CORS dengan opsi
app.use(cors(corsOptions));
const mysql = require('mysql');

// Konfigurasi koneksi
const db = mysql.createConnection({
  host: 'localhost', // Ganti dengan host database Anda
  user: 'root',      // Ganti dengan username database Anda
  password: '',      // Ganti dengan password database Anda
  database: 'library', // Ganti dengan nama database Anda
});

// Hubungkan ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1); // Keluar jika koneksi gagal
  }
  console.log('Connected to the database');
});

// Endpoint untuk mendapatkan semua buku
app.get('/books', (req, res) => {
  const query = 'SELECT * FROM books';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('Query results:', results);
    if (results.length === 0) {
      return res.send("Belum ada buku yang tersedia pada perpustakaan ini bang");
    } else {
      res.json(results);
    }
  });
});

// Endpoint untuk mendapatkan buku berdasarkan ID
app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM books WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      res.status(404).send('Buku tidak ditemukan');
    } else {
      res.json(results[0]);
    }
  });
});

// Endpoint untuk menambahkan buku baru
app.post('/books', (req, res) => {
  const { title, author, year, genre } = req.body;
  const query = 'INSERT INTO books (title, author, year, genre) VALUES (?, ?, ?, ?)';
  db.query(query, [title, author, year || new Date().getFullYear(), genre || 'Unknown'], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, title, author, year, genre });
  });
});


// Endpoint untuk memperbarui buku berdasarkan ID
app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, year, genre } = req.body;
  const query = 'UPDATE books SET title = ?, author = ?, year = ?, genre = ? WHERE id = ?';
  db.query(query, [title, author, year, genre, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Buku tidak ditemukan');
    } else {
      res.json({ id, title, author, year, genre });
    }
  });
});


// Endpoint untuk menghapus buku berdasarkan ID
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM books WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Buku tidak ditemukan');
    } else {
      res.send('Buku berhasil dihapus');
    }
  });
});


// Menjalankan server
app.listen(port, () => {
  console.log(`Book management app listening on http://localhost:${port}`);
});
