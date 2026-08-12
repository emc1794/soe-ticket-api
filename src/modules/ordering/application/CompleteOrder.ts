import { Order, OrderStatus } from '../domain/Order';
import { OrderRepository } from '../domain/OrderRepository';
import { TicketRepository } from '../domain/TicketRepository';
import { Ticket } from '../domain/Ticket';
import { EventBus } from '../../../shared/domain/bus/EventBus';
import { TicketPurchased } from '../domain/events/TicketPurchased';

export class CompleteOrder {
  constructor(
    private orderRepository: OrderRepository,
    private ticketRepository: TicketRepository,
    private eventBus: EventBus
  ) {}

  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status === OrderStatus.PAID) {
      return order;
    }

    order.markAsPaid();
    await this.orderRepository.save(order);

    const seatsToIssue = order.seatNumbers.length > 0 ? order.seatNumbers : [undefined];
    for (const seatNumber of seatsToIssue) {
      const ticketId = Math.random().toString(36).substring(2, 15);
      const ticket = new Ticket(ticketId, order.id, order.eventId, order.userId, seatNumber, `QR-${ticketId}`);
      await this.ticketRepository.save(ticket);

      await this.eventBus.publish([
        new TicketPurchased(ticket.id, ticket.id, ticket.userId)
      ]);
    }

    return order;
  }
}
