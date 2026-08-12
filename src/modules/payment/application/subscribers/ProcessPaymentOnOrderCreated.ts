import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { OrderCreated } from '../../../ordering/domain/events/OrderCreated';
import { ProcessPayment } from '../ProcessPayment';

export class ProcessPaymentOnOrderCreated implements DomainEventSubscriber<OrderCreated> {
  constructor(private processPayment: ProcessPayment) {}

  subscribedTo(): DomainEventClass[] {
    return [OrderCreated];
  }

  async on(event: OrderCreated): Promise<void> {
    await this.processPayment.execute({
      orderId: event.aggregateId,
      userId: event.userId,
      amount: event.amount,
    });
  }
}
