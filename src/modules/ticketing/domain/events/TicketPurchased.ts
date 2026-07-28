import { DomainEvent } from '../../../../shared/domain/events/DomainEvent';

export class TicketPurchased extends DomainEvent {
  static EVENT_NAME = 'ticketing.ticket_purchased';

  readonly ticketId: string;
  readonly userId: string;

  constructor(aggregateId: string, ticketId: string, userId: string, eventId?: string, occurredOn?: Date) {
    super(aggregateId, eventId, occurredOn);
    this.ticketId = ticketId;
    this.userId = userId;
  }

  eventName(): string {
    return TicketPurchased.EVENT_NAME;
  }
}
