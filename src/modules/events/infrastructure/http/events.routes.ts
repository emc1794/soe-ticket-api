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
 *     description: Searches the event catalog by city, artist, and/or date range. All filters are optional and combined with AND semantics.
 *     tags: [events]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *         example: Madrid
 *       - in: query
 *         name: artist
 *         schema: { type: string }
 *         example: Rock Band
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Matching events
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Event' }
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.get('/', (req, res) => eventsController.search(req, res));

/**
 * @swagger
 * /events/{id}/cancel:
 *   post:
 *     summary: Cancel an event
 *     description: Marks an event as CANCELLED and publishes the 'EventCancelled' domain event so the Notification module can alert ticket holders.
 *     tags: [events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event cancelled successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/:id/cancel', (req, res, next) => eventsController.cancel(req, res, next));

router.use('/venues', venuesRoutes);
router.use('/search', searchRoutes);

export default router;
