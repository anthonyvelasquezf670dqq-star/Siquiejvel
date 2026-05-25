const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Book = require('../models/book.model');

const DEFAULT_USERS = [
  {
    name: 'Admin de Biblioteca',
    email: 'admin@ownlibrary.local',
    password: 'Admin123!',
    role: 'admin'
  },
  {
    name: 'Bibliotecario',
    email: 'librarian@ownlibrary.local',
    password: 'Lib12345!',
    role: 'librarian'
  }
];

const DEFAULT_BOOKS = [
  {
    title: 'A Tale of Two Cities',
    author: 'Charles Dickens',
    isbn: '9780141439600',
    category: 'Clásicos',
    publishedYear: 1859,
    totalCopies: 2,
    availableCopies: 2,
    description: 'Novela clásica de Dickens disponible para leer online.',
    pdfUrl: 'https://www.gutenberg.org/cache/epub/98/pg98-images.html'
  },
  {
    title: 'Dracula',
    author: 'Bram Stoker',
    isbn: '9780141439846',
    category: 'Terror',
    publishedYear: 1897,
    totalCopies: 2,
    availableCopies: 2,
    description: 'Clásico gótico de Bram Stoker con lectura online.',
    pdfUrl: 'https://www.gutenberg.org/cache/epub/345/pg345-images.html'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    category: 'Romance',
    publishedYear: 1813,
    totalCopies: 2,
    availableCopies: 2,
    description: 'La novela romántica de Jane Austen disponible para leer online.',
    pdfUrl: 'https://www.gutenberg.org/cache/epub/1342/pg1342-images.html'
  },
  {
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    isbn: '9780141439563',
    category: 'Misterio',
    publishedYear: 1892,
    totalCopies: 2,
    availableCopies: 2,
    description: 'Colección de aventuras del detective Sherlock Holmes.',
    pdfUrl: 'https://www.gutenberg.org/cache/epub/1661/pg1661-images.html'
  }
];

const seedInitialData = async () => {
  try {
    const existingAdmin = await User.findOne({ email: DEFAULT_USERS[0].email });
    if (!existingAdmin) {
      for (const user of DEFAULT_USERS) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.create({
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role
        });
      }
      console.log('Initial users seeded');
    }

    let createdBooks = 0;
    for (const book of DEFAULT_BOOKS) {
      const existingBook = await Book.findOne({ title: book.title });
      if (existingBook) {
        await Book.updateOne(
          { _id: existingBook._id },
          {
            $set: {
              author: book.author,
              isbn: book.isbn,
              category: book.category,
              publishedYear: book.publishedYear,
              totalCopies: book.totalCopies,
              availableCopies: book.availableCopies,
              description: book.description,
              pdfUrl: book.pdfUrl
            }
          }
        );
        continue;
      }

      await Book.create(book);
      createdBooks += 1;
    }

    if (createdBooks > 0) {
      console.log(`Initial books seeded (${createdBooks} new books)`);
    }
  } catch (error) {
    console.error('Error seeding initial data', error);
  }
};

module.exports = seedInitialData;
