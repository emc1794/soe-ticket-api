import { EventBus } from '../../../shared/domain/bus/EventBus';
import { PaymentSuccessful } from '../domain/events/PaymentSuccessful';
import { PaymentFailed } from '../domain/events/PaymentFailed';
import { v4 as uuid } from 'uuid';

export interface ProcessPaymentRequest {
  orderId: string;
  userId: string;
  amount: number;
}

export class ProcessPayment {
  constructor(private eventBus: EventBus) {}

  async execute(request: ProcessPaymentRequest): Promise<void> {
    // Mock payment gateway call - always succeeds in this baseline implementation
    console.log(`[Payment Module] Processing payment for order ${request.orderId} with amount ${request.amount}`);
    const succeeded = true;

    if (succeeded) {
      await this.eventBus.publish([
        new PaymentSuccessful(uuid(), request.orderId, request.userId, request.amount)
      ]);
    } else {
      await this.eventBus.publish([
        new PaymentFailed(uuid(), request.orderId, request.userId, 'Payment declined by gateway')
      ]);
    }
  }
}
