import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { EventUpdated } from '../../../catalog/domain/events/EventUpdated';

export class NotifyOnEventUpdated implements DomainEventSubscriber<EventUpdated> {
  subscribedTo(): DomainEventClass[] {
    return [EventUpdated];
  }

  async on(event: EventUpdated): Promise<void> {
    console.log(`Notification: Attention all ticket holders! The event ${event.title} (${event.aggregateId}) has been updated. New date: ${event.date}`);
  }
}
