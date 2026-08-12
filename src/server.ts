import app from './app';
import { connectDB } from './database/mysql';
import { logger } from './utils/logger';
import { registerSubscribers } from './shared/infrastructure/bus/subscribers';
import { eventBus } from './shared/infrastructure/bus/sharedEventBus';

const startServer = async () => {
  try {
    // Connect to the RabbitMQ-backed domain event bus
    await eventBus.connect();

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

const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Closing event bus connection...`);
  await eventBus.close();
  process.exit(0);
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

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
