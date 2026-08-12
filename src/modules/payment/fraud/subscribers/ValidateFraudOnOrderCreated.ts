import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { OrderCreated } from '../../../../shared/contracts/OrderCreated';
import { EventBus } from '../../../../shared/domain/bus/EventBus';
import { CheckFraud } from '../CheckFraud';
import { ProcessPayment } from '../../application/ProcessPayment';
import { PaymentFailed } from '../../domain/events/PaymentFailed';
import { v4 as uuid } from 'uuid';

/**
 * Gates payment on 'OrderCreated' delivered from the broker (published by the Ordering
 * Service). On a fraud pass, Payment is called in-process (both modules are still co-located
 * in this monolith). On rejection, the Fraud module itself publishes 'PaymentFailed' back to
 * the broker — Payment is never invoked for a rejected order.
 */
export class ValidateFraudOnOrderCreated implements DomainEventSubscriber<OrderCreated> {
  constructor(
    private checkFraud: CheckFraud,
    private processPayment: ProcessPayment,
    private eventBus: EventBus
  ) {}

  subscribedTo(): DomainEventClass[] {
    return [OrderCreated];
  }

  async on(event: OrderCreated): Promise<void> {
    const fraudResult = await this.checkFraud.execute(event.userId);

    if (fraudResult.isFraud) {
      await this.eventBus.publish([
        new PaymentFailed(uuid(), event.aggregateId, event.userId, `Fraud check rejected: ${fraudResult.reason}`)
      ]);
      return;
    }

    // Fraud check passed — process payment (Internal Call)
    await this.processPayment.execute({
      orderId: event.aggregateId,
      userId: event.userId,
      amount: event.amount,
    });
  }
}
