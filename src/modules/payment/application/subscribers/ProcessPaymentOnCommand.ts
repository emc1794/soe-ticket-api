import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { ProcessPaymentCommand } from '../../../ordering/domain/commands/ProcessPaymentCommand';
import { ProcessPayment } from '../ProcessPayment';

export class ProcessPaymentOnCommand implements DomainEventSubscriber<ProcessPaymentCommand> {
  constructor(private processPayment: ProcessPayment) {}

  subscribedTo(): DomainEventClass[] {
    return [ProcessPaymentCommand];
  }

  async on(event: ProcessPaymentCommand): Promise<void> {
    await this.processPayment.execute({
      orderId: event.orderId,
      userId: event.userId,
      amount: event.amount,
    });
  }
}
