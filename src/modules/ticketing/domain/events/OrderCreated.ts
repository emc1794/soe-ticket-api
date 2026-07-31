import { DomainEvent } from '../../../../shared/domain/events/DomainEvent';

export class OrderCreated extends DomainEvent {
  static EVENT_NAME = 'ticketing.order_created';

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
    eventId_?: string, 
    occurredOn?: Date
  ) {
    super(aggregateId, eventId_, occurredOn);
    this.userId = userId;
    this.eventId = eventId;
    this.amount = amount;
    this.seatNumbers = seatNumbers;
  }

  eventName(): string {
    return OrderCreated.EVENT_NAME;
  }
}
