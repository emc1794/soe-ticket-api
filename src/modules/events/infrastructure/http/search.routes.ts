import { Router } from 'express';
import { successResponse } from '../../../../shared/response';

const router = Router();

/**
 * @swagger
 * /events/search:
 *   get:
 *     summary: General-purpose search placeholder
 *     description: Placeholder endpoint reserved for a future general-purpose search capability, separate from the event-specific search at GET /events.
 *     tags: [search]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({}, 'search module is working'));
});

export default router;
