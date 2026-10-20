
import { useState } from 'react';
import { books as initialBooks } from '../data/books.js';
import BookCard from './BookCard.jsx';
import NewBook from './NewBook.jsx';

const BookList = () => {
  const [books, setBooks] = useState(initialBooks);
  const [showUnread, setShowUnread] = useState(false);

  const toggleRead = (id) => {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === id
          ? { ...book, read: !book.read }
          : book
      )
    );
  };

  const addBook = ({ title, author, year }) => {
    setBooks((currentBooks) => {
      const nextId = Math.max(
        0,
        ...currentBooks.map((book) => book.id)
      ) + 1;

      return [
        ...currentBooks,
        {
          id: nextId,
          title,
          author,
          year,
          read: false,
        },
      ];
    });
  };

  const visibleBooks = showUnread
    ? books.filter((book) => !book.read)
    : books;

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

      <NewBook onAdd={addBook} />
    </>
  );
};

export default BookList;
