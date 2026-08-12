import { Router } from 'express';
import { successResponse } from '../../../../shared/response';

const router = Router();

/**
 * @swagger
 * /payment:
 *   get:
 *     summary: Payment Module status
 *     description: >
 *       The Payment Module has no public HTTP surface — it processes payments by consuming
 *       'OrderCreated' (delivered via the Fraud Check Module) and publishing 'PaymentSuccessful'
 *       / 'PaymentFailed' on the RabbitMQ event bus. This endpoint only confirms the module is
 *       mounted.
 *     tags: [payment]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({}, 'payments module is working'));
});

export default router;
