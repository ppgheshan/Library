const STORAGE_KEYS = {
  books: 'lms_books',
  borrowed: 'lms_borrowed',
  theme: 'lms_theme'
};

const getBorrowedMap = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.borrowed) || '{}');
const setBorrowedMap = (map) => localStorage.setItem(STORAGE_KEYS.borrowed, JSON.stringify(map));

const generateBorrowId = () => `BR-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

const showToast = (message, type = 'success') => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show fixed bottom-6 right-6 px-4 py-3 rounded-lg text-sm text-white shadow-lg z-50 ${type === 'error' ? 'bg-red-500' : 'bg-slate-900'}`;
  setTimeout(() => toast.classList.remove('show'), 2600);
};

const initThemeToggle = () => {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  if (saved === 'dark') document.documentElement.classList.add('dark');
  if (!btn) return;

  const syncLabel = () => {
    btn.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
  };

  syncLabel();
  btn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem(STORAGE_KEYS.theme, document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    syncLabel();
  });
};

const loadBooks = async () => {
  const custom = localStorage.getItem(STORAGE_KEYS.books);
  if (custom) return JSON.parse(custom);
  const res = await fetch('data/books.json');
  const books = await res.json();
  localStorage.setItem(STORAGE_KEYS.books, JSON.stringify(books));
  return books;
};

const saveBooks = (books) => localStorage.setItem(STORAGE_KEYS.books, JSON.stringify(books));

const withBorrowStatus = (books) => {
  const borrowed = getBorrowedMap();
  return books.map((book) => ({ ...book, availability: !borrowed[book.id] }));
};

const renderBookCard = (book, { showActions = true } = {}) => `
  <article class="book-card rounded-2xl overflow-hidden fade-in">
    <img src="${book.image}" alt="${book.title}" class="w-full h-52 object-cover" />
    <div class="p-4 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <h3 class="font-semibold line-clamp-1">${book.title}</h3>
        <span class="text-xs px-2 py-1 rounded-full ${book.availability ? 'badge-available' : 'badge-borrowed'}">${book.availability ? 'Available' : 'Borrowed'}</span>
      </div>
      <p class="text-sm text-slate-500 dark:text-slate-400">${book.author}</p>
      <p class="text-xs inline-block px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200">${book.category}</p>
      ${showActions ? `<div class="flex gap-2 pt-2">
        <a href="book-details.html?id=${book.id}" class="flex-1 text-center text-sm py-2 rounded-lg bg-slate-900 text-white dark:bg-blue-600">Details</a>
        <button data-borrow-id="${book.id}" class="borrow-btn flex-1 text-sm py-2 rounded-lg border border-slate-300 dark:border-slate-700 ${book.availability ? '' : 'opacity-50 cursor-not-allowed'}" ${book.availability ? '' : 'disabled'}>Borrow</button>
      </div>` : ''}
    </div>
  </article>`;

const initBorrowModal = () => {
  const modal = document.getElementById('borrowModal');
  const confirm = document.getElementById('confirmBorrow');
  const close = document.getElementById('closeModal');
  if (!modal) return { askBorrow: async () => false };

  let resolver;
  const cleanup = () => {
    modal.classList.remove('show');
  };

  const resolveBorrow = (value) => {
    if (resolver) resolver(value);
    resolver = null;
  };

  close.addEventListener('click', () => {
    cleanup();
    resolveBorrow(false);
  });

  confirm.addEventListener('click', () => {
    cleanup();
    resolveBorrow(true);
  });

  return {
    askBorrow: () => {
      modal.classList.add('show');
      return new Promise((resolve) => {
        resolver = resolve;
      });
    }
  };
};

window.LMS = {
  STORAGE_KEYS,
  loadBooks,
  saveBooks,
  withBorrowStatus,
  renderBookCard,
  getBorrowedMap,
  setBorrowedMap,
  generateBorrowId,
  showToast,
  initThemeToggle,
  initBorrowModal
};

document.addEventListener('DOMContentLoaded', initThemeToggle);
