import app from './app';
import { connectDB } from './database/mysql';
import { logger } from './utils/logger';
import { registerSubscribers } from './shared/infrastructure/bus/subscribers';

const startServer = async () => {
  try {
    // Register Domain Event Subscribers
    registerSubscribers();

    // Connect to Database
    await connectDB();
    
    // Start Listening
    app.listen();
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});
