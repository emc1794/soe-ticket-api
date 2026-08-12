import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { PaymentSuccessful } from '../../../payment/domain/events/PaymentSuccessful';
import { BookingSagaOrchestrator } from '../BookingSagaOrchestrator';

export class AdvanceSagaOnPaymentSuccessful implements DomainEventSubscriber<PaymentSuccessful> {
  constructor(private saga: BookingSagaOrchestrator) {}

  subscribedTo(): DomainEventClass[] {
    return [PaymentSuccessful];
  }

  async on(event: PaymentSuccessful): Promise<void> {
    await this.saga.onPaymentSuccessful(event);
  }
}
