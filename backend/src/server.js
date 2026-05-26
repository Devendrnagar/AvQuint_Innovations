const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  try {
    await connectDB();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.error('The API is running, but database-backed routes will not work until MongoDB is available.');
  }
}

start();
