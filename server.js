const express = require('express');

const app = express();
const PORT = 3000;
const books = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    copiesAvailable: 3,
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    copiesAvailable: 5,
  },
  {
    id: 3,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    copiesAvailable: 7,
  },
];

app.use(express.json());

app.get('/api/books', (_req, res) => {
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = books.find((book) => book.id === id);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.json(book);
});

app.post('/api/books', (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    copiesAvailable: req.body.copiesAvailable,
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = books.find((book) => book.id === id);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  book.title = req.body.title;
  book.author = req.body.author;
  book.copiesAvailable = req.body.copiesAvailable;

  res.json(book);
});

app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  books.splice(bookIndex, 1);
  res.status(204).send();
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { app, books };