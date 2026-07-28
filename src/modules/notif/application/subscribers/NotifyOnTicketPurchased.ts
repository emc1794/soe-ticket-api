import { DomainEventSubscriber, DomainEventClass } from '../../../../shared/domain/events/DomainEvent';
import { TicketPurchased } from '../../../ticketing/domain/events/TicketPurchased';

export class NotifyOnTicketPurchased implements DomainEventSubscriber<TicketPurchased> {
  subscribedTo(): DomainEventClass[] {
    return [TicketPurchased];
  }

  async on(event: TicketPurchased): Promise<void> {
    console.log(`[Notification Module] Notifying user ${event.userId} about ticket ${event.ticketId}`);
    // Aquí iría la lógica de envío de email/push/etc.
  }
}
