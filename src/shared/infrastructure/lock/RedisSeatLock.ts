import redis from '../../../database/redis';
import { logger } from '../../../utils/logger';

export class RedisSeatLock {
  private static readonly LOCK_PREFIX = 'seat_lock:';
  private static readonly DEFAULT_TTL = 600; // 10 minutes in seconds

  async lock(eventId: string, seatNumber: string, userId: string, ttl: number = RedisSeatLock.DEFAULT_TTL): Promise<boolean> {
    const key = this.getKey(eventId, seatNumber);
    
    // Use SET with NX (Not Exists) and EX (Expire)
    const result = await redis.set(key, userId, 'EX', ttl, 'NX');
    
    if (result === 'OK') {
      logger.info(`Seat ${seatNumber} for event ${eventId} locked by user ${userId} for ${ttl}s`);
      return true;
    }
    
    logger.warn(`Failed to lock seat ${seatNumber} for event ${eventId} (already locked)`);
    return false;
  }

  async unlock(eventId: string, seatNumber: string): Promise<void> {
    const key = this.getKey(eventId, seatNumber);
    await redis.del(key);
    logger.info(`Seat ${seatNumber} for event ${eventId} unlocked`);
  }

  async isLocked(eventId: string, seatNumber: string): Promise<boolean> {
    const key = this.getKey(eventId, seatNumber);
    const result = await redis.exists(key);
    return result === 1;
  }

  private getKey(eventId: string, seatNumber: string): string {
    return `${RedisSeatLock.LOCK_PREFIX}${eventId}:${seatNumber}`;
  }
}

export const seatLock = new RedisSeatLock();
