import { Router } from 'express';
import { successResponse } from '../../../shared/response';

const router = Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Example endpoint for events
 *     tags: [events]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({}, 'events module is working'));
});

export default router;
