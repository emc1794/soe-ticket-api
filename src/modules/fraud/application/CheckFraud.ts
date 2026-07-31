import redis from '../../../database/redis';

export class CheckFraud {
  private static readonly ORDER_COUNT_PREFIX = 'order_count:';
  private static readonly MAX_ORDERS_PER_MINUTE = 5;

  async execute(userId: string): Promise<{ isFraud: boolean; reason?: string }> {
    const key = `${CheckFraud.ORDER_COUNT_PREFIX}${userId}`;
    
    const count = await redis.incr(key);
    
    if (count === 1) {
      await redis.expire(key, 60);
    }
    
    if (count > CheckFraud.MAX_ORDERS_PER_MINUTE) {
      return { isFraud: true, reason: 'Too many orders in a short time' };
    }
    
    return { isFraud: false };
  }
}
