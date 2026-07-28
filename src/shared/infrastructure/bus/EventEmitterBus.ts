import { EventEmitter } from 'events';
import { DomainEvent, DomainEventSubscriber } from '../../domain/events/DomainEvent';
import { EventBus } from '../../domain/bus/EventBus';

export class EventEmitterBus extends EventEmitter implements EventBus {
  async publish(events: DomainEvent[]): Promise<void> {
    events.map((event) => {
      this.emit(event.eventName(), event);
    });
  }

  addSubscribers(subscribers: DomainEventSubscriber<DomainEvent>[]): void {
    subscribers.map((subscriber) => {
      subscriber.subscribedTo().map((event) => {
        this.on(event.EVENT_NAME, (domainEvent: DomainEvent) => {
          subscriber.on(domainEvent);
        });
      });
    });
  }
}
