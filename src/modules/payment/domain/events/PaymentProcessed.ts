import { DomainEvent } from '../../../../shared/domain/events/DomainEvent';

export class PaymentProcessed extends DomainEvent {
  static EVENT_NAME = 'payment.payment_processed';

  readonly orderId: string;
  readonly status: 'SUCCESS' | 'FAILED';

  constructor(aggregateId: string, orderId: string, status: 'SUCCESS' | 'FAILED', eventId?: string, occurredOn?: Date) {
    super(aggregateId, eventId, occurredOn);
    this.orderId = orderId;
    this.status = status;
  }

  eventName(): string {
    return PaymentProcessed.EVENT_NAME;
  }
}
