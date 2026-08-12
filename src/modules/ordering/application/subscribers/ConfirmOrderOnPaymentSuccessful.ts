import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { PaymentSuccessful } from '../../../payment/domain/events/PaymentSuccessful';
import { OrderRepository } from '../../domain/OrderRepository';
import { TicketRepository } from '../../domain/TicketRepository';
import { Ticket } from '../../domain/Ticket';
import { EventBus } from '../../../../shared/domain/bus/EventBus';
import { TicketPurchased } from '../../domain/events/TicketPurchased';
import { seatLock } from '../../../../shared/infrastructure/lock/RedisSeatLock';

export class ConfirmOrderOnPaymentSuccessful implements DomainEventSubscriber<PaymentSuccessful> {
  constructor(
    private orderRepository: OrderRepository,
    private ticketRepository: TicketRepository,
    private eventBus: EventBus
  ) {}

  subscribedTo(): DomainEventClass[] {
    return [PaymentSuccessful];
  }

  async on(event: PaymentSuccessful): Promise<void> {
    const order = await this.orderRepository.findById(event.orderId);
    if (!order) {
      console.error(`Order ${event.orderId} not found`);
      return;
    }

    if (order.status === 'PAID') return;

    order.markAsPaid();
    await this.orderRepository.save(order);

    // Generar Tickets
    if (order.seatNumbers && order.seatNumbers.length > 0) {
      for (const seatNumber of order.seatNumbers) {
        const ticketId = Math.random().toString(36).substring(2, 15);
        const ticket = new Ticket(
          ticketId,
          order.id,
          order.eventId,
          order.userId,
          seatNumber,
          `QR-${ticketId}`
        );
        await this.ticketRepository.save(ticket);

        await this.eventBus.publish([
          new TicketPurchased(ticket.id, ticket.id, ticket.userId)
        ]);

        // Liberar el lock de Redis ya que la compra fue exitosa y ahora está en MySQL
        await seatLock.unlock(order.eventId, seatNumber);
      }
    } else {
      // General Admission o no seats specified
      const ticketId = Math.random().toString(36).substring(2, 15);
      const ticket = new Ticket(
        ticketId,
        order.id,
        order.eventId,
        order.userId,
        undefined,
        `QR-${ticketId}`
      );
      await this.ticketRepository.save(ticket);

      await this.eventBus.publish([
        new TicketPurchased(ticket.id, ticket.id, ticket.userId)
      ]);
    }
  }
}
