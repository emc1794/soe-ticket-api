import { Router } from 'express';
import { EventsController } from './EventsController';
import { SearchEvents } from '../../application/SearchEvents';
import { eventRepository } from '../../../../shared/infrastructure/persistence/RepositoryContainer';
import venuesRoutes from './venues.routes';
import searchRoutes from './search.routes';

const router = Router();

const searchEvents = new SearchEvents(eventRepository);
const eventsController = new EventsController(searchEvents);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Search events
 *     tags: [events]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: artist
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => eventsController.search(req, res));

router.use('/venues', venuesRoutes);
router.use('/search', searchRoutes);

export default router;
