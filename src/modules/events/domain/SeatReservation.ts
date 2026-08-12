import { RedisSeatLock, seatLock } from '../../../shared/infrastructure/lock/RedisSeatLock';

export class SeatReservation {
  constructor(private lockProvider: RedisSeatLock = seatLock) {}

  async reserve(eventId: string, seatNumbers: string[], userId: string): Promise<boolean> {
    const reservedSeats: string[] = [];

    for (const seatNumber of seatNumbers) {
      const locked = await this.lockProvider.lock(eventId, seatNumber, userId);
      if (!locked) {
        // Rollback
        await this.release(eventId, reservedSeats);
        return false;
      }
      reservedSeats.push(seatNumber);
    }

    return true;
  }

  async release(eventId: string, seatNumbers: string[]): Promise<void> {
    for (const seatNumber of seatNumbers) {
      await this.lockProvider.unlock(eventId, seatNumber);
    }
  }
}
