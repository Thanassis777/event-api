import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  process.exit(1);
});

// loads environment variables from .env file into process.env
dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log('Application started on port: ', port));

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...', err);
  server.close(() => process.exit(1));
});
