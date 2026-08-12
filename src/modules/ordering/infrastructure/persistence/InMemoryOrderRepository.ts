import { Order } from '../../domain/Order';
import { OrderRepository } from '../../domain/OrderRepository';

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  async save(order: Order): Promise<void> {
    const index = this.orders.findIndex(o => o.id === order.id);
    if (index !== -1) {
      this.orders[index] = order;
    } else {
      this.orders.push(order);
    }
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find(o => o.id === id) || null;
  }
}
