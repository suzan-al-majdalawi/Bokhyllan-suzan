
const BookCard = ({ book }) => (
  <article className="book-card" data-testid="book-card">
    <h2 data-testid="book-title">{book.title}</h2>

    <p data-testid="book-meta">
      {book.author} · {book.year}
    </p>
    
// extra att vissa om Book läst eller inte
    {book.read && (
      <span className="badge" data-testid="badge-read">
        Läst
      </span>
    )}
  </article>
);

export default BookCard;
