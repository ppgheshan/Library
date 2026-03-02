document.addEventListener('DOMContentLoaded', async () => {
  const { loadBooks, saveBooks, withBorrowStatus, showToast } = window.LMS;
  const tbody = document.getElementById('booksTableBody');
  const form = document.getElementById('addBookForm');
  if (!tbody || !form) return;

  let books = await loadBooks();

  const render = () => {
    const borrowedMap = JSON.parse(localStorage.getItem('lms_borrowed') || '{}');
    tbody.innerHTML = withBorrowStatus(books).map((book) => `
      <tr class="border-b border-slate-200 dark:border-slate-800">
        <td class="p-2">${book.id}</td>
        <td class="p-2"><input data-edit="title" data-id="${book.id}" value="${book.title}" class="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded px-2 py-1" /></td>
        <td class="p-2"><input data-edit="author" data-id="${book.id}" value="${book.author}" class="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded px-2 py-1" /></td>
        <td class="p-2"><input data-edit="category" data-id="${book.id}" value="${book.category}" class="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded px-2 py-1" /></td>
        <td class="p-2 text-xs">${borrowedMap[book.id] ? 'Borrowed' : 'Available'}</td>
        <td class="p-2"><button data-delete="${book.id}" class="text-red-500">Delete</button></td>
      </tr>`).join('');

    tbody.querySelectorAll('input[data-edit]').forEach((input) => {
      input.addEventListener('change', () => {
        const id = Number(input.dataset.id);
        const field = input.dataset.edit;
        books = books.map((book) => (book.id === id ? { ...book, [field]: input.value } : book));
        saveBooks(books);
        showToast('Book updated');
      });
    });

    tbody.querySelectorAll('button[data-delete]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.delete);
        books = books.filter((book) => book.id !== id);
        saveBooks(books);
        showToast('Book deleted');
        render();
      });
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nextId = books.length ? Math.max(...books.map((book) => book.id)) + 1 : 1;
    books.push({
      id: nextId,
      title: data.get('title'),
      author: data.get('author'),
      category: data.get('category'),
      description: data.get('description') || 'Added from dashboard.',
      image: data.get('image') || 'assets/images/book-cover-1.svg',
      availability: true
    });
    saveBooks(books);
    form.reset();
    showToast('Book added');
    render();
  });

  render();
});
