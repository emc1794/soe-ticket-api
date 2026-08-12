import { Router } from 'express';
import { successResponse } from '../../../../shared/response';

const router = Router();

/**
 * @swagger
 * /notification:
 *   get:
 *     summary: Notification Module status
 *     description: >
 *       The Notification Module has no public HTTP surface — it reacts to 'EventUpdated',
 *       'EventCancelled', and 'PaymentSuccessful' on the RabbitMQ event bus to send alerts.
 *       This endpoint only confirms the module is mounted.
 *     tags: [notification]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({}, 'notifications module is working'));
});

export default router;
