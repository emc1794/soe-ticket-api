import { Response } from 'express';
import { PlaceOrder } from '../../application/PlaceOrder';
import { successResponse } from '../../../../shared/response';
import { AuthRequest } from '../../../../middlewares/auth.middleware';

export class TicketingController {
  constructor(private placeOrder: PlaceOrder) {}

  async createOrder(req: AuthRequest, res: Response) {
    try {
      const { id, eventId, amount, seatNumbers, promoCode } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      await this.placeOrder.execute({ 
        id, 
        userId, 
        eventId, 
        amount, 
        seatNumbers, 
        promoCode 
      });

      res.status(201).json(successResponse({}, 'Order created successfully'));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
