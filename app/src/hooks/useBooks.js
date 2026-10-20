
import { useEffect, useState } from 'react';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setBooks(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const addBook = async (newBook) => {
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
  };

  const toggleRead = async (id) => {
    const book = books.find((b) => b.id === id);

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
      currentBooks.map((b) =>
        b.id === id ? updated : b
      )
    );
  };

  return {
    books,
    loading,
    error,
    addBook,
    toggleRead,
  };
};
