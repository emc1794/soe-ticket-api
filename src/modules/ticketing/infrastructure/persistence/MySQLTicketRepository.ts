import { Ticket } from '../../domain/Ticket';
import { TicketRepository } from '../../domain/TicketRepository';
import { TicketModel } from '../../../../shared/infrastructure/persistence/sequelize/TicketModel';

export class MySQLTicketRepository implements TicketRepository {
  async save(ticket: Ticket): Promise<void> {
    await TicketModel.upsert({
      id: ticket.id,
      orderId: ticket.orderId,
      eventId: ticket.eventId,
      userId: ticket.userId,
      seatNumber: ticket.seatNumber,
      qrCode: ticket.qrCode,
    });
  }

  async findByOrderId(orderId: string): Promise<Ticket[]> {
    const models = await TicketModel.findAll({ where: { orderId } });
    return models.map(this.toDomain);
  }

  async findByEventId(eventId: string): Promise<Ticket[]> {
    const models = await TicketModel.findAll({ where: { eventId } });
    return models.map(this.toDomain);
  }

  private toDomain(model: TicketModel): Ticket {
    return new Ticket(
      model.id,
      model.orderId,
      model.eventId,
      model.userId,
      model.seatNumber,
      model.qrCode
    );
  }
}
