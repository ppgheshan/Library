document.addEventListener('DOMContentLoaded', async () => {
  const { loadBooks, withBorrowStatus, getBorrowedMap, setBorrowedMap, generateBorrowId, showToast } = window.LMS;
  const list = document.getElementById('borrowList');
  if (!list) return;
  let books = withBorrowStatus(await loadBooks());
  const forcedId = Number(new URLSearchParams(window.location.search).get('id'));

  const render = () => {
    const borrowed = getBorrowedMap();
    list.innerHTML = books.map((book) => {
      const borrowInfo = borrowed[book.id];
      return `<div class="book-card rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 class="font-semibold">${book.title}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">${book.author} • ${book.category}</p>
          ${borrowInfo ? `<p class="text-xs mt-1 text-emerald-600">Borrow ID: ${borrowInfo.borrowId}</p>` : ''}
        </div>
        ${book.availability
          ? `<button data-action="borrow" data-id="${book.id}" class="px-4 py-2 rounded-lg bg-blue-600 text-white">Borrow</button>`
          : `<button data-action="return" data-id="${book.id}" class="px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-700">Return</button>`}
      </div>`;
    }).join('');

    list.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const map = getBorrowedMap();
        if (btn.dataset.action === 'borrow') {
          map[id] = { borrowId: generateBorrowId(), borrowedAt: new Date().toISOString() };
          showToast(`Borrowed successfully (${map[id].borrowId})`);
        } else {
          delete map[id];
          showToast('Book returned successfully');
        }
        setBorrowedMap(map);
        books = withBorrowStatus(books);
        render();
      });
    });
  };

  if (forcedId) {
    const map = getBorrowedMap();
    if (!map[forcedId]) {
      map[forcedId] = { borrowId: generateBorrowId(), borrowedAt: new Date().toISOString() };
      setBorrowedMap(map);
      showToast(`Borrowed successfully (${map[forcedId].borrowId})`);
    }
  }

  render();
});
