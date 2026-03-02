document.addEventListener('DOMContentLoaded', async () => {
  const {
    loadBooks, saveBooks, withBorrowStatus, renderBookCard,
    getBorrowedMap, setBorrowedMap, generateBorrowId, showToast, initBorrowModal
  } = window.LMS;
  const grid = document.getElementById('booksGrid');
  if (!grid) return;

  const search = document.getElementById('searchInput');
  const category = document.getElementById('categoryFilter');
  const modal = initBorrowModal();

  let books = await loadBooks();

  const render = () => {
    const q = search.value.toLowerCase();
    const cat = category.value;
    const filtered = withBorrowStatus(books).filter((book) => {
      const textMatch = book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
      const catMatch = cat === 'All' || book.category === cat;
      return textMatch && catMatch;
    });

    grid.innerHTML = filtered.length
      ? filtered.map((book) => renderBookCard(book)).join('')
      : '<p class="col-span-full text-center text-slate-500">No books found.</p>';

    grid.querySelectorAll('.borrow-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const bookId = Number(btn.dataset.borrowId);
        const accepted = await modal.askBorrow();
        if (!accepted) return;
        const borrowed = getBorrowedMap();
        borrowed[bookId] = {
          borrowId: generateBorrowId(),
          borrowedAt: new Date().toISOString()
        };
        setBorrowedMap(borrowed);
        showToast(`Book borrowed successfully. ID: ${borrowed[bookId].borrowId}`);
        render();
      });
    });
  };

  ['input', 'change'].forEach((ev) => search.addEventListener(ev, render));
  category.addEventListener('change', render);
  render();
});
