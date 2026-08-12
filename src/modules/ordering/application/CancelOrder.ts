import { OrderRepository } from '../domain/OrderRepository';
import { OrderStatus } from '../domain/Order';
import { EventBus } from '../../../shared/domain/bus/EventBus';
import { OrderCancelled } from '../domain/events/OrderCancelled';

export class CancelOrder {
  constructor(
    private orderRepository: OrderRepository,
    private eventBus: EventBus
  ) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status === OrderStatus.CANCELLED) return;

    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);

    await this.eventBus.publish([
      new OrderCancelled(order.id, order.userId, order.eventId, order.amount)
    ]);
  }
}
