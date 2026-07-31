import { Router } from 'express';
import { CatalogController } from './CatalogController';
import { SearchEvents } from '../../application/SearchEvents';
import { eventRepository } from '../../../../shared/infrastructure/persistence/RepositoryContainer';

const router = Router();

const searchEvents = new SearchEvents(eventRepository);
const catalogController = new CatalogController(searchEvents);

/**
 * @swagger
 * /catalog/events:
 *   get:
 *     summary: Search events
 *     tags: [catalog]
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
router.get('/', (req, res) => catalogController.search(req, res));

export default router;
