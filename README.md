# LibraryHub - Library Management System (Frontend Only)

A modern **Library Management System** built with **HTML5 + TailwindCSS + Vanilla JavaScript**, using **LocalStorage** for persistence.

## Project Structure

```
index.html
books.html
book-details.html
borrow.html
dashboard.html
css/
  styles.css
js/
  app.js
  home.js
  books.js
  details.js
  borrow.js
  dashboard.js
data/
  books.json
assets/images/
  logo.svg
  book-cover-1.svg ... book-cover-5.svg
```

## Features

- Home page with featured books
- Books listing page with:
  - live search (title/author)
  - category filtering
  - availability badges
- Book details page
- Borrow / return page
- Admin dashboard page (add/edit/delete books)
- Borrow confirmation modal
- Toast notifications
- Dark mode toggle
- Responsive modern UI
- Fake borrow ID generation (`BR-...`)

## Run Locally

1. Open terminal in this folder.
2. Start a local static server (recommended):

```bash
python3 -m http.server 8000
```

3. Open your browser:

- Home: `http://localhost:8000/index.html`
- Books: `http://localhost:8000/books.html`
- Dashboard: `http://localhost:8000/dashboard.html`

> Note: first load reads `data/books.json` and stores it in LocalStorage (`lms_books`).

## LocalStorage Keys

- `lms_books`: current editable book catalog
- `lms_borrowed`: borrowed map `{ [bookId]: { borrowId, borrowedAt } }`
- `lms_theme`: `light` or `dark`

## Reset Data

If you want to reset the app to initial data:

1. Open browser DevTools
2. Clear LocalStorage for this site
3. Refresh page
