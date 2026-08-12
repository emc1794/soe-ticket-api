import { DomainEvent } from '../../../../shared/domain/events/DomainEvent';

/**
 * Saga command: the Booking Saga Orchestrator asks the Payment module (async, via the
 * message broker) to charge an order. Modeled on the same DomainEvent infrastructure as
 * regular domain events since the bus does not distinguish commands from facts.
 */
export class ProcessPaymentCommand extends DomainEvent {
  static EVENT_NAME = 'ordering.process_payment_command';

  readonly orderId: string;
  readonly userId: string;
  readonly amount: number;

  constructor(aggregateId: string, orderId: string, userId: string, amount: number, eventId?: string, occurredOn?: Date) {
    super(aggregateId, eventId, occurredOn);
    this.orderId = orderId;
    this.userId = userId;
    this.amount = amount;
  }

  eventName(): string {
    return ProcessPaymentCommand.EVENT_NAME;
  }
}
