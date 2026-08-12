import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { PaymentSuccessful } from '../../../payment/domain/events/PaymentSuccessful';

export class IssueDigitalPassOnPaymentSuccessful implements DomainEventSubscriber<PaymentSuccessful> {
  subscribedTo(): DomainEventClass[] {
    return [PaymentSuccessful];
  }

  async on(event: PaymentSuccessful): Promise<void> {
    console.log(`[Identity Module] Issuing digital pass to user ${event.userId} for order ${event.orderId}`);
  }
}
