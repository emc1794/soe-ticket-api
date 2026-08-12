import { DomainEvent } from '../domain/events/DomainEvent';

/**
 * External event contract published by the (independently deployed) Ordering Service, which
 * now owns the Order/Ticket domain and its own isolated database. This monolith only reacts
 * to it over the broker — it no longer creates or stores orders itself.
 */
export class OrderCreated extends DomainEvent {
  static EVENT_NAME = 'ordering.order_created';

  readonly userId: string;
  readonly eventId: string;
  readonly amount: number;
  readonly seatNumbers: string[];

  constructor(
    aggregateId: string,
    userId: string,
    eventId: string,
    amount: number,
    seatNumbers: string[] = [],
    domainEventId?: string,
    occurredOn?: Date
  ) {
    super(aggregateId, domainEventId, occurredOn);
    this.userId = userId;
    this.eventId = eventId;
    this.amount = amount;
    this.seatNumbers = seatNumbers;
  }

  eventName(): string {
    return OrderCreated.EVENT_NAME;
  }
}
