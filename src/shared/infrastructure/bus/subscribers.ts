import { eventBus } from './sharedEventBus';
import { NotifyOnTicketPurchased } from '../../../modules/notification/application/subscribers/NotifyOnTicketPurchased';
import { NotifyOnOrderCancelled } from '../../../modules/notification/application/subscribers/NotifyOnOrderCancelled';
import { NotifyOnEventUpdated } from '../../../modules/notification/application/subscribers/NotifyOnEventUpdated';
import { ConfirmOrderOnPaymentProcessed } from '../../../modules/ordering/application/subscribers/ConfirmOrderOnPaymentProcessed';
import { orderRepository, ticketRepository } from '../persistence/RepositoryContainer';

export function registerSubscribers() {
  eventBus.addSubscribers([
    new NotifyOnTicketPurchased(),
    new NotifyOnOrderCancelled(),
    new NotifyOnEventUpdated(),
    new ConfirmOrderOnPaymentProcessed(orderRepository, ticketRepository, eventBus)
  ]);
}
