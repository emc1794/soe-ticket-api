import { EventBus } from '../../../shared/domain/bus/EventBus';
import { PaymentProcessed } from '../domain/events/PaymentProcessed';
import { v4 as uuid } from 'uuid';

export class ProcessPayment {
  constructor(private eventBus: EventBus) {}

  async execute(orderId: string, amount: number): Promise<void> {
    // Mock payment processing logic
    console.log(`Processing payment for order ${orderId} with amount ${amount}`);
    
    // Simulate successful payment
    const status = 'SUCCESS';
    
    await this.eventBus.publish([
      new PaymentProcessed(uuid(), orderId, status)
    ]);
  }
}
