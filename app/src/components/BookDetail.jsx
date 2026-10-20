
import { Link, useParams } from 'react-router';
import { useBooks } from '../hooks/useBooks.js';
import { useFavorites } from '../context/FavoritesContext.jsx';

const BookDetail = () => {
  const { id } = useParams();
  const { books, loading, error, toggleRead } = useBooks();
  const { favorites, dispatch } = useFavorites();

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

  const book = books.find((item) => item.id === Number(id));

  if (!book) {
    return <p data-testid="not-found">Boken finns inte</p>;
  }

  const isFavorite = favorites.includes(book.id);

  return (
    <section className="book-detail" data-testid="book-detail">
      <h2 data-testid="detail-title">{book.title}</h2>

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
        onClick={() => toggleRead(book.id)}
      >
        {book.read ? 'Markera som oläst' : 'Markera som läst'}
      </button>

      <button
        type="button"
        data-testid="toggle-favorite"
        onClick={() =>
          dispatch({ type: 'toggle', id: book.id })
        }
      >
        {isFavorite ? 'Ta bort favorit' : 'Lägg till som favorit'}
      </button>

      <Link to="/" data-testid="back-link">
        Tillbaka
      </Link>
    </section>
  );
};

export default BookDetail;
