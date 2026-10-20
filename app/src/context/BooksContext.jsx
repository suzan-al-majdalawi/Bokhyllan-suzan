
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const BooksContext = createContext(null);

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (active) {
          setBooks(data);
        }
      } catch {
        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      active = false;
    };
  }, []);

  const addBook = useCallback(async (newBook) => {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      throw new Error('Kunde inte lägga till boken');
    }

    const created = await response.json();

    setBooks((currentBooks) => [...currentBooks, created]);

    return created;
  }, []);

  const toggleRead = useCallback(async (id) => {
    const book = books.find((item) => item.id === id);

    if (!book) return;

    const response = await fetch(`/api/books/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ read: !book.read }),
    });

    if (!response.ok) {
      throw new Error('Kunde inte ändra lässtatus');
    }

    const updated = await response.json();

    setBooks((currentBooks) =>
      currentBooks.map((item) =>
        item.id === id ? updated : item
      )
    );

    return updated;
  }, [books]);

  return (
    <BooksContext.Provider
      value={{
        books,
        loading,
        error,
        addBook,
        toggleRead,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);

  if (!context) {
    throw new Error(
      'useBooks måste användas inom BooksProvider'
    );
  }

  return context;
};
