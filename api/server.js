// Mock-API för Bokhyllan. Data ligger i minnet och
// återställs när servern startar om.
import express from 'express';
import { initialBooks } from './data.js';

const PORT = 4000;
const app = express();
app.use(express.json());

let books = structuredClone(initialBooks);

const findBook = (id) =>
  books.find((book) => book.id === Number(id));

app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/books/:id', (req, res) => {
  const book = findBook(req.params.id);
  if (!book) {
    return res
      .status(404)
      .json({ message: 'Boken finns inte' });
  }
  res.json(book);
});

app.post('/books', (req, res) => {
  const { title, author, year } = req.body ?? {};
  if (!title || !author) {
    return res
      .status(400)
      .json({ message: 'Fyll i titel och författare' });
  }
  const nextId =
    Math.max(0, ...books.map((book) => book.id)) + 1;
  const newBook = {
    id: nextId,
    title,
    author,
    year: year ?? null,
    read: false,
  };
  books = [...books, newBook];
  res.status(201).json(newBook);
});

app.patch('/books/:id', (req, res) => {
  const book = findBook(req.params.id);
  if (!book) {
    return res
      .status(404)
      .json({ message: 'Boken finns inte' });
  }
  const updated = {
    ...book,
    read: Boolean(req.body?.read),
  };
  books = books.map((b) =>
    b.id === updated.id ? updated : b
  );
  res.json(updated);
});

// Används av testerna: tillbaka till de sex
// startböckerna.
app.post('/reset', (req, res) => {
  books = structuredClone(initialBooks);
  res.json(books);
});

app.listen(PORT, () => {
  console.log(`API på http://localhost:${PORT}`);
});
