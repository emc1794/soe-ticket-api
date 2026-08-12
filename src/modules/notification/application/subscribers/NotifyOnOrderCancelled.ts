import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { OrderCancelled } from '../../../ordering/domain/events/OrderCancelled';

export class NotifyOnOrderCancelled implements DomainEventSubscriber<OrderCancelled> {
  subscribedTo(): DomainEventClass[] {
    return [OrderCancelled];
  }

  async on(event: OrderCancelled): Promise<void> {
    console.log(`Notification: User ${event.userId}, your order ${event.aggregateId} has been cancelled and a refund of ${event.amount} has been processed.`);
  }
}
