import { MySQLEventRepository } from '../../../modules/events/infrastructure/persistence/MySQLEventRepository';
import { MySQLVenueRepository } from '../../../modules/events/infrastructure/persistence/MySQLVenueRepository';
import { MySQLUserRepository } from '../../../modules/identity/infrastructure/persistence/MySQLUserRepository';

export const eventRepository = new MySQLEventRepository();
export const venueRepository = new MySQLVenueRepository();
export const userRepository = new MySQLUserRepository();
