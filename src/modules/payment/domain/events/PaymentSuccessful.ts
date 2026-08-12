import { DomainEvent } from '../../../../shared/domain/events/DomainEvent';

export class PaymentSuccessful extends DomainEvent {
  static EVENT_NAME = 'payment.payment_successful';

  readonly orderId: string;
  readonly userId: string;
  readonly amount: number;

  constructor(aggregateId: string, orderId: string, userId: string, amount: number, eventId?: string, occurredOn?: Date) {
    super(aggregateId, eventId, occurredOn);
    this.orderId = orderId;
    this.userId = userId;
    this.amount = amount;
  }

  eventName(): string {
    return PaymentSuccessful.EVENT_NAME;
  }
}
