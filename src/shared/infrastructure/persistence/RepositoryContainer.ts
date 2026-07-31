import { MySQLOrderRepository } from '../../../modules/ticketing/infrastructure/persistence/MySQLOrderRepository';
import { MySQLTicketRepository } from '../../../modules/ticketing/infrastructure/persistence/MySQLTicketRepository';
import { MySQLEventRepository } from '../../../modules/catalog/infrastructure/persistence/MySQLEventRepository';
import { MySQLVenueRepository } from '../../../modules/catalog/infrastructure/persistence/MySQLVenueRepository';
import { MySQLUserRepository } from '../../../modules/users/infrastructure/persistence/MySQLUserRepository';

export const orderRepository = new MySQLOrderRepository();
export const ticketRepository = new MySQLTicketRepository();
export const eventRepository = new MySQLEventRepository();
export const venueRepository = new MySQLVenueRepository();
export const userRepository = new MySQLUserRepository();
