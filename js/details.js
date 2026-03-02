document.addEventListener('DOMContentLoaded', async () => {
  const { loadBooks, withBorrowStatus, showToast } = window.LMS;
  const target = document.getElementById('detailsContainer');
  if (!target) return;

  const id = Number(new URLSearchParams(window.location.search).get('id'));
  const books = withBorrowStatus(await loadBooks());
  const book = books.find((item) => item.id === id);

  if (!book) {
    target.innerHTML = '<p class="text-red-500">Book not found.</p>';
    return;
  }

  target.innerHTML = `
    <img src="${book.image}" alt="${book.title}" class="w-full md:w-72 rounded-2xl shadow-lg object-cover" />
    <div class="space-y-3">
      <p class="text-sm text-blue-600 dark:text-blue-300">${book.category}</p>
      <h1 class="text-3xl font-bold">${book.title}</h1>
      <p class="text-slate-500 dark:text-slate-400">By ${book.author}</p>
      <p class="leading-relaxed">${book.description}</p>
      <p class="inline-block px-3 py-1 rounded-full text-sm ${book.availability ? 'badge-available' : 'badge-borrowed'}">${book.availability ? 'Available now' : 'Currently borrowed'}</p>
      <div><a href="borrow.html?id=${book.id}" class="inline-block mt-4 px-5 py-2 rounded-lg bg-slate-900 text-white dark:bg-blue-600">Borrow from Borrow Page</a></div>
    </div>`;
});
