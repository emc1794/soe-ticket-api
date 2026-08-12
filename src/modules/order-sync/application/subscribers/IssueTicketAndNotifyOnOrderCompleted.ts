import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { OrderCompleted } from '../../../../shared/contracts/OrderCompleted';
import { IssueDigitalPass } from '../../../identity/application/IssueDigitalPass';
import { SendOrderConfirmation } from '../../../notification/application/SendOrderConfirmation';

/**
 * The "Ordering Event Consumer" component: listens for 'OrderCompleted' from the (externally
 * deployed) Ordering Service and triggers the two things that still live in this monolith —
 * digital pass issuance (Identity) and the confirmation alert (Notification) — via direct,
 * in-process calls.
 */
export class IssueTicketAndNotifyOnOrderCompleted implements DomainEventSubscriber<OrderCompleted> {
  constructor(
    private issueDigitalPass: IssueDigitalPass,
    private sendOrderConfirmation: SendOrderConfirmation
  ) {}

  subscribedTo(): DomainEventClass[] {
    return [OrderCompleted];
  }

  async on(event: OrderCompleted): Promise<void> {
    await this.issueDigitalPass.execute({ orderId: event.aggregateId, userId: event.userId });
    await this.sendOrderConfirmation.execute({
      orderId: event.aggregateId,
      userId: event.userId,
      amount: event.amount,
    });
  }
}
