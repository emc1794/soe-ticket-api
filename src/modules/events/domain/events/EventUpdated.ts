import { DomainEvent } from '../../../../shared/domain/events/DomainEvent';

export class EventUpdated extends DomainEvent {
  static EVENT_NAME = 'events.event_updated';

  readonly title: string;
  readonly date: Date;
  readonly venueId: string;

  constructor(
    aggregateId: string,
    title: string,
    date: Date,
    venueId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(aggregateId, eventId, occurredOn);
    this.title = title;
    this.date = date;
    this.venueId = venueId;
  }

  eventName(): string {
    return EventUpdated.EVENT_NAME;
  }
}
