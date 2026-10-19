
import { books } from '../data/books.js';
import BookCard from './BookCard.jsx';

const BookList = () => (
  <section className="book-list">
    {books.map((book) => (
      <BookCard key={book.id} book={book} />
    ))}
  </section>
);

export default BookList;
