require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const seedInitialData = require('./utils/seed');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/ownlibrary';
let memoryServer;

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB connected to ${MONGO_URI}`);
  } catch (error) {
    console.warn('Primary MongoDB connection failed, starting in-memory MongoDB:', error.message);
    memoryServer = await MongoMemoryServer.create();
    const mongoUri = memoryServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB in-memory connected to ${mongoUri}`);
  }
};

connectDatabase()
  .then(async () => {
    await seedInitialData();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database setup error:', error);
    process.exit(1);
  });
