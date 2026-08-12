import { DomainEvent } from '../../../../shared/domain/events/DomainEvent';

export class PaymentFailed extends DomainEvent {
  static EVENT_NAME = 'payment.payment_failed';

  readonly orderId: string;
  readonly userId: string;
  readonly reason: string;

  constructor(aggregateId: string, orderId: string, userId: string, reason: string, eventId?: string, occurredOn?: Date) {
    super(aggregateId, eventId, occurredOn);
    this.orderId = orderId;
    this.userId = userId;
    this.reason = reason;
  }

  eventName(): string {
    return PaymentFailed.EVENT_NAME;
  }
}
