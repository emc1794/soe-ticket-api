import { Router } from 'express';
import { successResponse } from '../../../../shared/response';
import { venuePluginManager } from '../venue/sharedVenuePluginManager';

const router = Router();

/**
 * @swagger
 * /events/venues:
 *   get:
 *     summary: List venue integration providers
 *     description: Lists the venue integration providers currently registered in the Venue Plugin Manager (microkernel registry).
 *     tags: [venues]
 *     responses:
 *       200:
 *         description: Registered providers
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/VenueProviders' }
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({ providers: venuePluginManager.listProviders() }));
});

/**
 * @swagger
 * /events/venues/{id}/seating-map:
 *   get:
 *     summary: Sync a venue's seating map
 *     description: Delegates to the Venue Plugin Manager, which dispatches the call to the venue adapter registered for the given provider (defaults to "generic").
 *     tags: [venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Venue id.
 *       - in: query
 *         name: provider
 *         schema: { type: string, default: generic, enum: [generic, legacy] }
 *     responses:
 *       200:
 *         description: Seating map synced
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/SeatingMap' }
 *       500:
 *         description: No adapter registered for the requested provider
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
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
 *     summary: Get real-time seat availability
 *     description: Delegates to the Venue Plugin Manager, which dispatches the call to the venue adapter registered for the given provider (defaults to "generic").
 *     tags: [venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Venue id.
 *       - in: query
 *         name: provider
 *         schema: { type: string, default: generic, enum: [generic, legacy] }
 *     responses:
 *       200:
 *         description: Real-time availability
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/VenueAvailability' }
 *       500:
 *         description: No adapter registered for the requested provider
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
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
