import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { EventCancelled } from '../../../events/domain/events/EventCancelled';

export class NotifyOnEventCancelled implements DomainEventSubscriber<EventCancelled> {
  subscribedTo(): DomainEventClass[] {
    return [EventCancelled];
  }

  async on(event: EventCancelled): Promise<void> {
    console.log(`Notification: The event ${event.title} (${event.aggregateId}) has been cancelled. Refunds will follow.`);
  }
}
