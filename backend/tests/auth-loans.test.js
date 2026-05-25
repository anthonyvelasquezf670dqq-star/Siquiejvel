const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Book = require('../src/models/book.model');
const Loan = require('../src/models/loan.model');

process.env.JWT_SECRET = 'test-secret';

let mongoServer;
let memberToken;
let adminToken;
let createdBookId;
let createdLoanId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    dbName: 'ownlibrary-test'
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Book.deleteMany({});
  await Loan.deleteMany({});

  const adminPassword = await require('bcryptjs').hash('Admin123!', 10);
  const memberPassword = await require('bcryptjs').hash('Member123!', 10);

  const admin = await User.create({
    name: 'Admin Test',
    email: 'admin@test.local',
    password: adminPassword,
    role: 'admin'
  });

  const member = await User.create({
    name: 'Member Test',
    email: 'member@test.local',
    password: memberPassword,
    role: 'member'
  });

  const adminLogin = await request(app).post('/api/auth/login').send({
    email: 'admin@test.local',
    password: 'Admin123!'
  });

  const memberLogin = await request(app).post('/api/auth/login').send({
    email: 'member@test.local',
    password: 'Member123!'
  });

  adminToken = adminLogin.body.token;
  memberToken = memberLogin.body.token;

  const book = await Book.create({
    title: 'Libro de prueba',
    author: 'Autor de prueba',
    totalCopies: 1,
    availableCopies: 1,
    category: 'Test'
  });

  createdBookId = book._id.toString();
});

test('registra un nuevo usuario como member y genera token', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Nuevo usuario',
      email: 'nuevo@test.local',
      password: 'Password123'
    });

  expect(response.status).toBe(201);
  expect(response.body.user.role).toBe('member');
  expect(response.body.token).toBeTruthy();
});

test('permite al miembro crear un préstamo y solo ver sus préstamos', async () => {
  const loanResponse = await request(app)
    .post('/api/loans')
    .set('Authorization', `Bearer ${memberToken}`)
    .send({
      bookId: createdBookId,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    });

  expect(loanResponse.status).toBe(201);
  createdLoanId = loanResponse.body._id;

  const listResponse = await request(app)
    .get('/api/loans')
    .set('Authorization', `Bearer ${memberToken}`);

  expect(listResponse.status).toBe(200);
  expect(listResponse.body).toHaveLength(1);
  expect(listResponse.body[0]._id).toBe(createdLoanId);

  const book = await Book.findById(createdBookId);
  expect(book.availableCopies).toBe(0);
});

test('permite devolver el préstamo y actualizar el stock del libro', async () => {
  const loanResponse = await request(app)
    .post('/api/loans')
    .set('Authorization', `Bearer ${memberToken}`)
    .send({
      bookId: createdBookId,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    });

  expect(loanResponse.status).toBe(201);

  const returnResponse = await request(app)
    .patch(`/api/loans/${loanResponse.body._id}/return`)
    .set('Authorization', `Bearer ${adminToken}`);

  expect(returnResponse.status).toBe(200);
  expect(returnResponse.body.status).toBe('returned');

  const updatedBook = await Book.findById(createdBookId);
  expect(updatedBook.availableCopies).toBe(1);
});
