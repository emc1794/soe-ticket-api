import { Order, OrderStatus } from '../../domain/Order';
import { OrderRepository } from '../../domain/OrderRepository';
import { OrderModel } from '../../../../shared/infrastructure/persistence/sequelize/OrderModel';

export class MySQLOrderRepository implements OrderRepository {
  async save(order: Order): Promise<void> {
    await OrderModel.upsert({
      id: order.id,
      userId: order.userId,
      eventId: order.eventId,
      amount: order.amount,
      status: order.status,
      seatNumbers: order.seatNumbers,
      appliedPromoCode: order.appliedPromoCode,
      discountedAmount: order.discountedAmount,
    });
  }

  async findById(id: string): Promise<Order | null> {
    const model = await OrderModel.findByPk(id);
    if (!model) return null;
    return this.toDomain(model);
  }

  private toDomain(model: OrderModel): Order {
    return new Order(
      model.id,
      model.userId,
      model.eventId,
      Number(model.amount),
      model.status as OrderStatus,
      (model as any).createdAt,
      model.seatNumbers,
      model.appliedPromoCode,
      Number(model.discountedAmount)
    );
  }
}
