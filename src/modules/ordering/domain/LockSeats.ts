import { RedisSeatLock, seatLock } from '../../../shared/infrastructure/lock/RedisSeatLock';

export class LockSeats {
  constructor(private lockProvider: RedisSeatLock = seatLock) {}

  async execute(eventId: string, seatNumbers: string[], userId: string): Promise<boolean> {
    const lockedSeats: string[] = [];
    
    for (const seatNumber of seatNumbers) {
      const locked = await this.lockProvider.lock(eventId, seatNumber, userId);
      if (!locked) {
        // Rollback
        await this.release(eventId, lockedSeats);
        return false;
      }
      lockedSeats.push(seatNumber);
    }
    
    return true;
  }

  async release(eventId: string, seatNumbers: string[]): Promise<void> {
    for (const seatNumber of seatNumbers) {
      await this.lockProvider.unlock(eventId, seatNumber);
    }
  }
}
