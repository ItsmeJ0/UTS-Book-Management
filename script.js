const baseURL = 'http://localhost:3000'; // Sesuaikan dengan URL backend Anda

// Ambil referensi elemen
const bookList = document.getElementById('bookList');
const addBookForm = document.getElementById('addBookForm');

// Fungsi untuk memuat daftar buku
let books = []; // Variabel global untuk menyimpan daftar buku

// Fungsi untuk memuat daftar buku
function loadBooks() {
  axios.get('http://localhost:3000/books')
    .then(response => {
      books = response.data; // Menyimpan daftar buku ke dalam variabel global
      const bookList = document.getElementById('bookList');
      bookList.innerHTML = '';

      books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${book.id}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.year}</td>
          <td>${book.genre}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Hapus</button>
            <button class="btn btn-warning btn-sm" onclick="editBook(${book.id})">Edit</button>
          </td>
        `;
        bookList.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error loading books:', error);
      alert('Gagal memuat data buku!');
    });
}
// Muat buku saat halaman pertama kali dimuat
loadBooks();

// Fungsi untuk menambahkan buku baru
addBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = document.getElementById('year').value || new Date().getFullYear();
  const genre = document.getElementById('genre').value || 'Unknown';

  try {
    await axios.post(`${baseURL}/books`, { title, author, year, genre });
    addBookForm.reset();
    loadBooks(); // Refresh daftar buku
  } catch (error) {
    console.error('Error adding book:', error);
    alert('Gagal menambahkan buku');
  }
});

// Fungsi untuk menghapus buku
async function deleteBook(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus buku ini?')) return;

  try {
    await axios.delete(`${baseURL}/books/${id}`);
    loadBooks(); // Refresh daftar buku
  } catch (error) {
    console.error('Error deleting book:', error);
    alert('Gagal menghapus buku');
  }
}

// Fungsi untuk mengisi form edit dengan data buku
function editBook(id) {
  const book = books.find(book => book.id === id); // Cari buku berdasarkan ID
  if (book) {
    // Isi form dengan data buku yang ingin diedit
    document.getElementById('editTitle').value = book.title;
    document.getElementById('editAuthor').value = book.author;
    document.getElementById('editYear').value = book.year;
    document.getElementById('editGenre').value = book.genre;
    document.getElementById('editBookId').value = book.id;
    document.getElementById('editBookForm').style.display = 'block'; // Tampilkan form edit
  } else {
    console.log("Buku tidak ditemukan");
  }
}

// Membatalkan edit dan menyembunyikan form
function cancelEdit() {
  document.getElementById('editBookForm').style.display = 'none';
}

// Fungsi untuk memperbarui buku
document.getElementById('editBookForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('editBookId').value;
  const title = document.getElementById('editTitle').value;
  const author = document.getElementById('editAuthor').value;
  const year = document.getElementById('editYear').value || new Date().getFullYear();
  const genre = document.getElementById('editGenre').value || 'Unknown';

  try {
    await axios.put(`http://localhost:3000/books/${id}`, { title, author, year, genre });
    loadBooks(); // Refresh daftar buku setelah berhasil diupdate
    cancelEdit(); // Sembunyikan form edit
  } catch (error) {
    console.error('Error editing book:', error);
    alert('Gagal memperbarui buku');
  }
});