document.addEventListener('DOMContentLoaded', async () => {
  const { loadBooks, withBorrowStatus, renderBookCard } = window.LMS;
  const wrap = document.getElementById('featuredBooks');
  if (!wrap) return;
  const books = withBorrowStatus(await loadBooks()).slice(0, 6);
  wrap.innerHTML = books.map((book) => renderBookCard(book)).join('');
});
