
const BookCard = ({ book, onToggleRead }) => (
  <article className="book-card" data-testid="book-card">
    <h2 data-testid="book-title">{book.title}</h2>

    <p data-testid="book-meta">
      {book.author} · {book.year ?? 'Okänt år'}
    </p>

    {book.read && (
      <span className="badge" data-testid="badge-read">
        Läst
      </span>
    )}

    <button
      type="button"
      data-testid="toggle-read"
      onClick={() => onToggleRead(book.id)}
    >
      {book.read ? 'Markera som oläst' : 'Markera som läst'}
    </button>
  </article>
);

export default BookCard;
