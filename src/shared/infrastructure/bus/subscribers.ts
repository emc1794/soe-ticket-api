import { eventBus } from './sharedEventBus';
import { NotifyOnTicketPurchased } from '../../../modules/notif/application/subscribers/NotifyOnTicketPurchased';
import { NotifyOnOrderCancelled } from '../../../modules/notif/application/subscribers/NotifyOnOrderCancelled';
import { NotifyOnEventUpdated } from '../../../modules/notif/application/subscribers/NotifyOnEventUpdated';
import { ConfirmOrderOnPaymentProcessed } from '../../../modules/ticketing/application/subscribers/ConfirmOrderOnPaymentProcessed';
import { orderRepository, ticketRepository } from '../persistence/RepositoryContainer';

export function registerSubscribers() {
  eventBus.addSubscribers([
    new NotifyOnTicketPurchased(),
    new NotifyOnOrderCancelled(),
    new NotifyOnEventUpdated(),
    new ConfirmOrderOnPaymentProcessed(orderRepository, ticketRepository, eventBus)
  ]);
}
