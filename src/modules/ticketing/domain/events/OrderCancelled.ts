import { DomainEvent } from '../../../../shared/domain/events/DomainEvent';

export class OrderCancelled extends DomainEvent {
  static EVENT_NAME = 'ticketing.order_cancelled';

  readonly userId: string;
  readonly eventId: string;
  readonly amount: number;

  constructor(
    aggregateId: string,
    userId: string,
    eventId: string,
    amount: number,
    eventId_?: string,
    occurredOn?: Date
  ) {
    super(aggregateId, eventId_, occurredOn);
    this.userId = userId;
    this.eventId = eventId;
    this.amount = amount;
  }

  eventName(): string {
    return OrderCancelled.EVENT_NAME;
  }
}
