
import { useState } from 'react';
import BookCard from './BookCard.jsx';
import { useBooks } from '../hooks/useBooks.js';

const BookList = () => {
  const { books, loading, error, addBook, toggleRead } = useBooks();
  const [showUnread, setShowUnread] = useState(false);

  const visibleBooks = showUnread
    ? books.filter((book) => !book.read)
    : books;

  if (loading) {
    return <p data-testid="loading">Laddar böcker…</p>;
  }

  if (error) {
    return (
      <p data-testid="error">
        Kunde inte hämta böcker
      </p>
    );
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          data-testid="filter-unread"
          checked={showUnread}
          onChange={(event) => setShowUnread(event.target.checked)}
        />
        Visa bara olästa
      </label>

      <section className="book-list">
        {visibleBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onToggleRead={toggleRead}
          />
        ))}
      </section>
    </>
  );
};

export default BookList;
