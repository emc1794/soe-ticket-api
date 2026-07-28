import { DomainEvent, DomainEventSubscriber } from '../events/DomainEvent';

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;
  addSubscribers(subscribers: DomainEventSubscriber<DomainEvent>[]): void;
}
