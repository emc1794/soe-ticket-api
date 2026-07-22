import { Redis } from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

const redis = new Redis({
  host: config.REDIS.HOST,
  port: config.REDIS.PORT,
  password: config.REDIS.PASS || undefined,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('Redis connected successfully.');
});

redis.on('error', (err: Error) => {
  logger.error('Redis connection error:', err);
});

export default redis;
