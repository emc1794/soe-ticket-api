import { Router } from 'express';
import { successResponse } from '../../../../shared/response';

const router = Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Example endpoint for orders
 *     tags: [orders]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({}, 'orders module is working'));
});

export default router;
