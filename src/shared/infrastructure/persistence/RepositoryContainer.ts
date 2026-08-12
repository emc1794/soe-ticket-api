import { MySQLOrderRepository } from '../../../modules/ordering/infrastructure/persistence/MySQLOrderRepository';
import { MySQLTicketRepository } from '../../../modules/ordering/infrastructure/persistence/MySQLTicketRepository';
import { MySQLEventRepository } from '../../../modules/events/infrastructure/persistence/MySQLEventRepository';
import { MySQLVenueRepository } from '../../../modules/events/infrastructure/persistence/MySQLVenueRepository';
import { MySQLUserRepository } from '../../../modules/identity/infrastructure/persistence/MySQLUserRepository';

export const orderRepository = new MySQLOrderRepository();
export const ticketRepository = new MySQLTicketRepository();
export const eventRepository = new MySQLEventRepository();
export const venueRepository = new MySQLVenueRepository();
export const userRepository = new MySQLUserRepository();
