import { BookingSagaOrchestrator } from './BookingSagaOrchestrator';
import { orderRepository, ticketRepository } from '../../../shared/infrastructure/persistence/RepositoryContainer';
import { eventBus } from '../../../shared/infrastructure/bus/sharedEventBus';
import { SeatReservation } from '../../events/domain/SeatReservation';
import { CheckFraud } from '../../payment/fraud/CheckFraud';
import { IssueDigitalPass } from '../../identity/application/IssueDigitalPass';
import { CompleteOrder } from '../application/CompleteOrder';
import { CancelOrder } from '../application/CancelOrder';

export const bookingSagaOrchestrator = new BookingSagaOrchestrator(
  orderRepository,
  ticketRepository,
  new SeatReservation(),
  new CheckFraud(),
  new IssueDigitalPass(),
  new CompleteOrder(orderRepository, ticketRepository, eventBus),
  new CancelOrder(orderRepository, eventBus),
  eventBus
);
