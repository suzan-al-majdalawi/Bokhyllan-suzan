
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import BookCard from './BookCard.jsx';

const book = {
  id: 3,
  title: 'Aniara',
  author: 'Harry Martinson',
  year: 1956,
  read: false,
};

test('visar badgen Läst när boken är läst', () => {
  render(
    <MemoryRouter>
      <BookCard book={{ ...book, read: true }} onToggleRead={() => {}} />
    </MemoryRouter>
  );

  expect(screen.getByText('Läst')).toBeTruthy();
});

test('visar ingen badge när boken är oläst', () => {
  render(
    <MemoryRouter>
      <BookCard book={book} onToggleRead={() => {}} />
    </MemoryRouter>
  );

  expect(screen.queryByTestId('badge-read')).toBeNull();
});
