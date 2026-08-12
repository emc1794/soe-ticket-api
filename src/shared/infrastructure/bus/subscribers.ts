import { eventBus } from './sharedEventBus';
import { NotifyOnTicketPurchased } from '../../../modules/notification/application/subscribers/NotifyOnTicketPurchased';
import { NotifyOnOrderCancelled } from '../../../modules/notification/application/subscribers/NotifyOnOrderCancelled';
import { NotifyOnEventUpdated } from '../../../modules/notification/application/subscribers/NotifyOnEventUpdated';
import { NotifyOnEventCancelled } from '../../../modules/notification/application/subscribers/NotifyOnEventCancelled';
import { NotifyOnPaymentSuccessful } from '../../../modules/notification/application/subscribers/NotifyOnPaymentSuccessful';
import { ConfirmOrderOnPaymentSuccessful } from '../../../modules/ordering/application/subscribers/ConfirmOrderOnPaymentSuccessful';
import { CancelOrderOnPaymentFailed } from '../../../modules/ordering/application/subscribers/CancelOrderOnPaymentFailed';
import { CancelOrder } from '../../../modules/ordering/application/CancelOrder';
import { ProcessPaymentOnOrderCreated } from '../../../modules/payment/application/subscribers/ProcessPaymentOnOrderCreated';
import { ProcessPayment } from '../../../modules/payment/application/ProcessPayment';
import { IssueDigitalPassOnPaymentSuccessful } from '../../../modules/identity/application/subscribers/IssueDigitalPassOnPaymentSuccessful';
import { orderRepository, ticketRepository } from '../persistence/RepositoryContainer';

export function registerSubscribers(): void {
  const processPayment = new ProcessPayment(eventBus);
  const cancelOrder = new CancelOrder(orderRepository, eventBus);

  eventBus.addSubscribers([
    new NotifyOnTicketPurchased(),
    new NotifyOnOrderCancelled(),
    new NotifyOnEventUpdated(),
    new NotifyOnEventCancelled(),
    new NotifyOnPaymentSuccessful(),
    new ConfirmOrderOnPaymentSuccessful(orderRepository, ticketRepository, eventBus),
    new CancelOrderOnPaymentFailed(cancelOrder),
    new ProcessPaymentOnOrderCreated(processPayment),
    new IssueDigitalPassOnPaymentSuccessful(),
  ]);
}
