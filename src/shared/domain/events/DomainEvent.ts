export abstract class DomainEvent {
  static EVENT_NAME: string;
  readonly aggregateId: string;
  readonly eventId: string;
  readonly occurredOn: Date;

  constructor(aggregateId: string, eventId?: string, occurredOn?: Date) {
    this.aggregateId = aggregateId;
    this.eventId = eventId || this.generateId();
    this.occurredOn = occurredOn || new Date();
  }

  abstract eventName(): string;

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

export type DomainEventClass = {
  EVENT_NAME: string;
  new (...args: any[]): DomainEvent;
};

export interface DomainEventSubscriber<T extends DomainEvent> {
  subscribedTo(): DomainEventClass[];
  on(event: T): Promise<void>;
}
