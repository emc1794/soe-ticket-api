import { Response } from 'express';
import { BookingSagaOrchestrator } from '../../saga/BookingSagaOrchestrator';
import { successResponse } from '../../../../shared/response';
import { AuthRequest } from '../../../../middlewares/auth.middleware';

export class OrderingController {
  constructor(private bookingSaga: BookingSagaOrchestrator) {}

  async createOrder(req: AuthRequest, res: Response) {
    try {
      const { id, eventId, amount, seatNumbers } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      await this.bookingSaga.start({
        id,
        userId,
        eventId,
        amount,
        seatNumbers
      });

      res.status(202).json(successResponse(
        { id },
        'Booking saga started: seat reserved and fraud check passed, payment is processing'
      ));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
