
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewBook from './NewBook.jsx';

test('visar felmeddelande när formuläret skickas tomt', async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();

  render(<NewBook onAdd={onAdd} />);

  await user.click(screen.getByTestId('submit-book'));

  expect(screen.getByRole('alert').textContent).toBe(
    'Fyll i titel och författare'
  );
  expect(onAdd).not.toHaveBeenCalled();
});

test('anropar onAdd med rätt bok när formuläret är korrekt ifyllt', async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn().mockResolvedValue(undefined);

  render(<NewBook onAdd={onAdd} />);

  await user.type(screen.getByLabelText('Titel'), 'Pippi Långstrump');
  await user.type(screen.getByLabelText('Författare'), 'Astrid Lindgren');
  await user.type(screen.getByLabelText('År'), '1945');

  await user.click(screen.getByTestId('submit-book'));

  expect(onAdd).toHaveBeenCalledWith({
    title: 'Pippi Långstrump',
    author: 'Astrid Lindgren',
    year: 1945,
  });
});
