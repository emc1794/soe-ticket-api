import { Router } from 'express';
import { successResponse } from '../../../../shared/response';
import { venuePluginManager } from '../venue/sharedVenuePluginManager';

const router = Router();

/**
 * @swagger
 * /events/venues:
 *   get:
 *     summary: List venue integration providers registered in the Venue Plugin Manager
 *     tags: [venues]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({ providers: venuePluginManager.listProviders() }));
});

/**
 * @swagger
 * /events/venues/{id}/seating-map:
 *   get:
 *     summary: Sync a venue's seating map through the Venue Plugin Manager
 *     tags: [venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: provider
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id/seating-map', async (req, res, next) => {
  try {
    const seatingMap = await venuePluginManager.syncSeatingMap(req.params.id, req.query.provider as string | undefined);
    res.status(200).json(successResponse(seatingMap));
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /events/venues/{id}/availability:
 *   get:
 *     summary: Get real-time seat availability through the Venue Plugin Manager
 *     tags: [venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: provider
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id/availability', async (req, res, next) => {
  try {
    const availability = await venuePluginManager.getRealTimeAvailability(req.params.id, req.query.provider as string | undefined);
    res.status(200).json(successResponse(availability));
  } catch (error) {
    next(error);
  }
});

export default router;
