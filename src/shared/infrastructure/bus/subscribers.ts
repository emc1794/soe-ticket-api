import { eventBus } from './sharedEventBus';
import { NotifyOnEventUpdated } from '../../../modules/notification/application/subscribers/NotifyOnEventUpdated';
import { NotifyOnEventCancelled } from '../../../modules/notification/application/subscribers/NotifyOnEventCancelled';
import { NotifyOnPaymentSuccessful } from '../../../modules/notification/application/subscribers/NotifyOnPaymentSuccessful';
import { SendOrderConfirmation } from '../../../modules/notification/application/SendOrderConfirmation';
import { CheckFraud } from '../../../modules/payment/fraud/CheckFraud';
import { ValidateFraudOnOrderCreated } from '../../../modules/payment/fraud/subscribers/ValidateFraudOnOrderCreated';
import { ProcessPayment } from '../../../modules/payment/application/ProcessPayment';
import { IssueDigitalPass } from '../../../modules/identity/application/IssueDigitalPass';
import { IssueTicketAndNotifyOnOrderCompleted } from '../../../modules/order-sync/application/subscribers/IssueTicketAndNotifyOnOrderCompleted';

export function registerSubscribers(): void {
  const processPayment = new ProcessPayment(eventBus);
  const checkFraud = new CheckFraud();
  const issueDigitalPass = new IssueDigitalPass();
  const sendOrderConfirmation = new SendOrderConfirmation();

  eventBus.addSubscribers([
    // Events module: unchanged choreography.
    new NotifyOnEventUpdated(),
    new NotifyOnEventCancelled(),

    // Payment module: still announces its own outcome independently.
    new NotifyOnPaymentSuccessful(),

    // Fraud Check Module: gates payment on 'OrderCreated' delivered from the Ordering Service.
    new ValidateFraudOnOrderCreated(checkFraud, processPayment, eventBus),

    // Ordering Event Consumer: reacts to 'OrderCompleted' from the Ordering Service.
    new IssueTicketAndNotifyOnOrderCompleted(issueDigitalPass, sendOrderConfirmation),
  ]);
}
