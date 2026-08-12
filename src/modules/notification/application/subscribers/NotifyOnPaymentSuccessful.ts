import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { PaymentSuccessful } from '../../../payment/domain/events/PaymentSuccessful';

export class NotifyOnPaymentSuccessful implements DomainEventSubscriber<PaymentSuccessful> {
  subscribedTo(): DomainEventClass[] {
    return [PaymentSuccessful];
  }

  async on(event: PaymentSuccessful): Promise<void> {
    console.log(`Notification: User ${event.userId}, your payment of ${event.amount} for order ${event.orderId} was successful.`);
  }
}
