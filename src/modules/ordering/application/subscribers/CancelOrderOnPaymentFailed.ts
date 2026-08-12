import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { PaymentFailed } from '../../../payment/domain/events/PaymentFailed';
import { CancelOrder } from '../CancelOrder';

export class CancelOrderOnPaymentFailed implements DomainEventSubscriber<PaymentFailed> {
  constructor(private cancelOrder: CancelOrder) {}

  subscribedTo(): DomainEventClass[] {
    return [PaymentFailed];
  }

  async on(event: PaymentFailed): Promise<void> {
    await this.cancelOrder.execute(event.orderId);
  }
}
