import { Order } from '../domain/Order';
import { OrderRepository } from '../domain/OrderRepository';
import { TicketRepository } from '../domain/TicketRepository';
import { EventBus } from '../../../shared/domain/bus/EventBus';
import { OrderCreated } from '../domain/events/OrderCreated';
import { LockSeats } from '../domain/LockSeats';
import { ValidatePromoCode } from '../../promo/application/ValidatePromoCode';
import { CheckFraud } from '../../fraud/application/CheckFraud';

export interface PlaceOrderRequest {
  id: string;
  userId: string;
  eventId: string;
  amount: number;
  seatNumbers?: string[];
  promoCode?: string;
}

export class PlaceOrder {
  private lockSeats: LockSeats;

  constructor(
    private orderRepository: OrderRepository,
    private ticketRepository: TicketRepository,
    private eventBus: EventBus,
    private validatePromoCode: ValidatePromoCode,
    private checkFraud: CheckFraud
  ) {
    this.lockSeats = new LockSeats();
  }

  async execute(request: PlaceOrderRequest): Promise<void> {
    // 0. Fraud & Bot Detection
    const fraudResult = await this.checkFraud.execute(request.userId);
    if (fraudResult.isFraud) {
      throw new Error(`Fraud detected: ${fraudResult.reason}`);
    }

    const seatNumbers = request.seatNumbers || [];

    // 1. Validate seat availability in MySQL (for already PAID/existing tickets)
    if (seatNumbers.length > 0) {
      const existingTickets = await this.ticketRepository.findByEventId(request.eventId);
      const takenSeats = existingTickets
        .map(t => t.seatNumber)
        .filter((s): s is string => !!s);
      
      const unavailable = seatNumbers.filter(s => takenSeats.includes(s));
      if (unavailable.length > 0) {
        throw new Error(`Seats already taken: ${unavailable.join(', ')}`);
      }

      // 2. Acquire Redis locks
      const locked = await this.lockSeats.execute(request.eventId, seatNumbers, request.userId);
      if (!locked) {
        throw new Error('Some seats are temporarily locked by another user. Please try again in a few minutes.');
      }
    }

    // 3. Apply Promo Code
    let discountedAmount = 0;
    if (request.promoCode) {
      const promoResult = await this.validatePromoCode.execute(request.promoCode, request.amount);
      if (promoResult.isValid) {
        discountedAmount = promoResult.discountAmount;
      }
    }

    const order = Order.create(
      request.id,
      request.userId,
      request.eventId,
      request.amount,
      seatNumbers,
      request.promoCode,
      discountedAmount
    );

    await this.orderRepository.save(order);

    await this.eventBus.publish([
      new OrderCreated(order.id, order.userId, order.eventId, order.amount, seatNumbers)
    ]);
  }
}
