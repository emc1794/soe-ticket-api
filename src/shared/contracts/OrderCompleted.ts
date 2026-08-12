import { DomainEvent } from '../domain/events/DomainEvent';

/**
 * External event contract published by the (independently deployed) Ordering Service once it
 * has confirmed payment and finalized the order on its own side.
 */
export class OrderCompleted extends DomainEvent {
  static EVENT_NAME = 'ordering.order_completed';

  readonly userId: string;
  readonly eventId: string;
  readonly amount: number;

  constructor(aggregateId: string, userId: string, eventId: string, amount: number, domainEventId?: string, occurredOn?: Date) {
    super(aggregateId, domainEventId, occurredOn);
    this.userId = userId;
    this.eventId = eventId;
    this.amount = amount;
  }

  eventName(): string {
    return OrderCompleted.EVENT_NAME;
  }
}
