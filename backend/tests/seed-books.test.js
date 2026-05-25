const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedInitialData = require('../src/utils/seed');
const Book = require('../src/models/book.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'ownlibrary-seed-test' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Book.deleteMany({});
});

test('seedInitialData crea libros reales con contenido legible cuando la base está vacía', async () => {
  await seedInitialData();

  const books = await Book.find({}).sort({ title: 1 });

  expect(books).toHaveLength(4);
  expect(books.map((book) => book.title)).toEqual([
    'A Tale of Two Cities',
    'Dracula',
    'Pride and Prejudice',
    'The Adventures of Sherlock Holmes'
  ]);
  expect(books.every((book) => book.pdfUrl?.startsWith('https://www.gutenberg.org/'))).toBe(true);
});
