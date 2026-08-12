import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { PaymentFailed } from '../../../payment/domain/events/PaymentFailed';
import { BookingSagaOrchestrator } from '../BookingSagaOrchestrator';

export class CompensateSagaOnPaymentFailed implements DomainEventSubscriber<PaymentFailed> {
  constructor(private saga: BookingSagaOrchestrator) {}

  subscribedTo(): DomainEventClass[] {
    return [PaymentFailed];
  }

  async on(event: PaymentFailed): Promise<void> {
    await this.saga.onPaymentFailed(event);
  }
}
