
import { useState } from 'react';

const NewBook = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedYear = year.trim();

    if (
      !trimmedTitle ||
      !trimmedAuthor ||
      (trimmedYear && !/^\d{4}$/.test(trimmedYear))
    ) {
      setError(true);
      return;
    }

    try {
      await onAdd({
        title: trimmedTitle,
        author: trimmedAuthor,
        year: trimmedYear ? Number(trimmedYear) : null,
      });

      setTitle('');
      setAuthor('');
      setYear('');
      setError(false);
    } catch {
      setError(true);
    }
  };

  return (
    <form data-testid="new-book-form" onSubmit={handleSubmit}>
      <label htmlFor="input-title">Titel</label>
      <input
        id="input-title"
        data-testid="input-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor="input-author">Författare</label>
      <input
        id="input-author"
        data-testid="input-author"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
      />

      <label htmlFor="input-year">År</label>
      <input
        id="input-year"
        data-testid="input-year"
        value={year}
        onChange={(event) => setYear(event.target.value)}
      />

      {error && (
        <p role="alert" data-testid="form-error">
          Fyll i titel och författare
        </p>
      )}

      <button type="submit" data-testid="submit-book">
        Lägg till
      </button>
    </form>
  );
};

export default NewBook;
