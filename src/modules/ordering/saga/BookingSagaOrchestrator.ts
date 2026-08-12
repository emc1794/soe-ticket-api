import { Order } from '../domain/Order';
import { OrderRepository } from '../domain/OrderRepository';
import { TicketRepository } from '../domain/TicketRepository';
import { OrderCreated } from '../domain/events/OrderCreated';
import { ProcessPaymentCommand } from '../domain/commands/ProcessPaymentCommand';
import { CompleteOrder } from '../application/CompleteOrder';
import { CancelOrder } from '../application/CancelOrder';
import { EventBus } from '../../../shared/domain/bus/EventBus';
import { SeatReservation } from '../../events/domain/SeatReservation';
import { CheckFraud } from '../../payment/fraud/CheckFraud';
import { IssueDigitalPass } from '../../identity/application/IssueDigitalPass';
import { PaymentSuccessful } from '../../payment/domain/events/PaymentSuccessful';
import { PaymentFailed } from '../../payment/domain/events/PaymentFailed';

export interface StartBookingSagaRequest {
  id: string;
  userId: string;
  eventId: string;
  amount: number;
  seatNumbers?: string[];
}

/**
 * Coordinates the Booking -> Fraud Check -> Payment -> Issuance saga (orchestration, not
 * choreography): every cross-context call is issued FROM this orchestrator, and every module
 * it talks to (Events, Fraud, Identity, Ordering itself) stays unaware of the other steps.
 *
 * Steps 1-4 (reserve seat, validate fraud) are synchronous in-process calls, matching the
 * diagram's "Internal Call" / "Internal Event" relations. Step 5-6 (process payment) crosses
 * the RabbitMQ broker, so the saga pauses after publishing the command and resumes later via
 * onPaymentSuccessful/onPaymentFailed. There is no separate saga-state table: the Order's own
 * status in MySQL (PENDING -> PAID/CANCELLED) *is* the saga state, which keeps this scoped to
 * what the exercise asks for without a bespoke persistence model.
 */
export class BookingSagaOrchestrator {
  constructor(
    private orderRepository: OrderRepository,
    private ticketRepository: TicketRepository,
    private seatReservation: SeatReservation,
    private checkFraud: CheckFraud,
    private issueDigitalPass: IssueDigitalPass,
    private completeOrder: CompleteOrder,
    private cancelOrder: CancelOrder,
    private eventBus: EventBus
  ) {}

  async start(request: StartBookingSagaRequest): Promise<void> {
    const seatNumbers = request.seatNumbers || [];

    // Step 1-2: Command: Reserve Seat -> Event: Seat Reserved (Events module, internal call)
    if (seatNumbers.length > 0) {
      const existingTickets = await this.ticketRepository.findByEventId(request.eventId);
      const takenSeats = existingTickets.map((t) => t.seatNumber).filter((s): s is string => !!s);
      const unavailable = seatNumbers.filter((s) => takenSeats.includes(s));
      if (unavailable.length > 0) {
        throw new Error(`Seats already taken: ${unavailable.join(', ')}`);
      }

      const reserved = await this.seatReservation.reserve(request.eventId, seatNumbers, request.userId);
      if (!reserved) {
        throw new Error('Some seats are temporarily locked by another user. Please try again in a few minutes.');
      }
    }

    // Step 3-4: Command: Validate Fraud Risk -> Event: Fraud Check Passed (Payment/Fraud, internal call)
    const fraudResult = await this.checkFraud.execute(request.userId);
    if (fraudResult.isFraud) {
      // Compensation: release the seat reserved in step 1
      await this.seatReservation.release(request.eventId, seatNumbers);
      throw new Error(`Fraud detected: ${fraudResult.reason}`);
    }

    const order = Order.create(request.id, request.userId, request.eventId, request.amount, seatNumbers);
    await this.orderRepository.save(order);
    await this.eventBus.publish([
      new OrderCreated(order.id, order.userId, order.eventId, order.amount, seatNumbers)
    ]);

    // Step 5: Command: Process Payment, dispatched asynchronously over the broker (AMQP).
    // The saga pauses here and resumes in onPaymentSuccessful/onPaymentFailed.
    await this.eventBus.publish([
      new ProcessPaymentCommand(order.id, order.id, order.userId, order.amount)
    ]);
  }

  // Step 6-9: Event: Payment Successful -> Command: Issue Ticket -> Event: Ticket Issued ->
  // Update Order Status to 'Completed'
  async onPaymentSuccessful(event: PaymentSuccessful): Promise<void> {
    await this.issueDigitalPass.execute({ orderId: event.orderId, userId: event.userId });
    const order = await this.completeOrder.execute(event.orderId);
    await this.seatReservation.release(order.eventId, order.seatNumbers);
  }

  // Compensation: Release Seat, on payment failure, then cancel the order.
  async onPaymentFailed(event: PaymentFailed): Promise<void> {
    const order = await this.orderRepository.findById(event.orderId);
    if (order) {
      await this.seatReservation.release(order.eventId, order.seatNumbers);
    }
    await this.cancelOrder.execute(event.orderId);
  }
}
