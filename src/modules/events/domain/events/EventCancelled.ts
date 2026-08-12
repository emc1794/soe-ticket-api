import { DomainEvent } from '../../../../shared/domain/events/DomainEvent';

export class EventCancelled extends DomainEvent {
  static EVENT_NAME = 'events.event_cancelled';

  readonly title: string;

  constructor(aggregateId: string, title: string, eventId?: string, occurredOn?: Date) {
    super(aggregateId, eventId, occurredOn);
    this.title = title;
  }

  eventName(): string {
    return EventCancelled.EVENT_NAME;
  }
}
