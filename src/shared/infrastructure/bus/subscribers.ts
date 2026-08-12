import { eventBus } from './sharedEventBus';
import { NotifyOnTicketPurchased } from '../../../modules/notification/application/subscribers/NotifyOnTicketPurchased';
import { NotifyOnOrderCancelled } from '../../../modules/notification/application/subscribers/NotifyOnOrderCancelled';
import { NotifyOnEventUpdated } from '../../../modules/notification/application/subscribers/NotifyOnEventUpdated';
import { NotifyOnEventCancelled } from '../../../modules/notification/application/subscribers/NotifyOnEventCancelled';
import { NotifyOnPaymentSuccessful } from '../../../modules/notification/application/subscribers/NotifyOnPaymentSuccessful';
import { ProcessPaymentOnCommand } from '../../../modules/payment/application/subscribers/ProcessPaymentOnCommand';
import { ProcessPayment } from '../../../modules/payment/application/ProcessPayment';
import { AdvanceSagaOnPaymentSuccessful } from '../../../modules/ordering/saga/subscribers/AdvanceSagaOnPaymentSuccessful';
import { CompensateSagaOnPaymentFailed } from '../../../modules/ordering/saga/subscribers/CompensateSagaOnPaymentFailed';
import { bookingSagaOrchestrator } from '../../../modules/ordering/saga/sharedBookingSagaOrchestrator';

export function registerSubscribers(): void {
  const processPayment = new ProcessPayment(eventBus);

  eventBus.addSubscribers([
    // Notification module: unchanged choreography, reacts to events independently.
    new NotifyOnTicketPurchased(),
    new NotifyOnOrderCancelled(),
    new NotifyOnEventUpdated(),
    new NotifyOnEventCancelled(),
    new NotifyOnPaymentSuccessful(),

    // Payment module: executes the async "Process Payment" command dispatched by the saga.
    new ProcessPaymentOnCommand(processPayment),

    // Booking Saga Orchestrator: resumes the saga once Payment answers over the broker.
    new AdvanceSagaOnPaymentSuccessful(bookingSagaOrchestrator),
    new CompensateSagaOnPaymentFailed(bookingSagaOrchestrator),
  ]);
}
