import { Router } from 'express';
import { successResponse } from '../../../shared/response';

const router = Router();

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Example endpoint for payments
 *     tags: [payments]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({}, 'payments module is working'));
});

export default router;
