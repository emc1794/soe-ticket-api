import { Ticket } from './Ticket';

export interface TicketRepository {
  save(ticket: Ticket): Promise<void>;
  findByOrderId(orderId: string): Promise<Ticket[]>;
  findByEventId(eventId: string): Promise<Ticket[]>;
}
