import { Router } from 'express';
import { EventsController } from './EventsController';
import { SearchEvents } from '../../application/SearchEvents';
import { CancelEvent } from '../../application/CancelEvent';
import { eventRepository } from '../../../../shared/infrastructure/persistence/RepositoryContainer';
import { eventBus } from '../../../../shared/infrastructure/bus/sharedEventBus';
import venuesRoutes from './venues.routes';
import searchRoutes from './search.routes';

const router = Router();

const searchEvents = new SearchEvents(eventRepository);
const cancelEvent = new CancelEvent(eventRepository, eventBus);
const eventsController = new EventsController(searchEvents, cancelEvent);

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

/**
 * @swagger
 * /events/{id}/cancel:
 *   post:
 *     summary: Cancel an event and publish the 'EventCancelled' domain event
 *     tags: [events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/:id/cancel', (req, res, next) => eventsController.cancel(req, res, next));

router.use('/venues', venuesRoutes);
router.use('/search', searchRoutes);

export default router;
