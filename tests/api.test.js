const request = require('supertest');
const { app, books } = require('../server');

const initialBooks = [
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

beforeEach(() => {
  books.splice(0, books.length, ...initialBooks.map((book) => ({ ...book })));
});

describe('Books API', () => {
  test('GET /api/books returns all books', async () => {
    const response = await request(app).get('/api/books');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(initialBooks);
  });

  test('GET /api/books/:id returns a book by ID', async () => {
    const response = await request(app).get('/api/books/2');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(initialBooks[1]);
  });

  test('POST /api/books creates and returns a book', async () => {
    const newBook = {
      title: 'Dune',
      author: 'Frank Herbert',
      copiesAvailable: 4,
    };
    const response = await request(app).post('/api/books').send(newBook);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 4, ...newBook });

    const getResponse = await request(app).get('/api/books/4');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual(response.body);
  });

  test('PUT /api/books/:id updates an existing book', async () => {
    const updatedBook = {
      title: 'Nineteen Eighty-Four',
      author: 'George Orwell',
      copiesAvailable: 8,
    };
    const response = await request(app).put('/api/books/2').send(updatedBook);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 2, ...updatedBook });
  });

  test('DELETE /api/books/:id removes an existing book', async () => {
    const response = await request(app).delete('/api/books/2');

    expect(response.status).toBe(204);
    expect(books.some((book) => book.id === 2)).toBe(false);
  });

  test('GET, PUT, and DELETE return 404 for unknown IDs', async () => {
    const getResponse = await request(app).get('/api/books/999');
    const putResponse = await request(app)
      .put('/api/books/999')
      .send({ title: 'Missing', author: 'Nobody', copiesAvailable: 0 });
    const deleteResponse = await request(app).delete('/api/books/999');

    expect(getResponse.status).toBe(404);
    expect(getResponse.body).toEqual({ error: 'Book not found' });
    expect(putResponse.status).toBe(404);
    expect(putResponse.body).toEqual({ error: 'Book not found' });
    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body).toEqual({ error: 'Book not found' });
  });
});