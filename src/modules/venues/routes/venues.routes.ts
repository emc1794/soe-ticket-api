import { Router } from 'express';
import { successResponse } from '../../../shared/response';

const router = Router();

/**
 * @swagger
 * /venues:
 *   get:
 *     summary: Example endpoint for venues
 *     tags: [venues]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({}, 'venues module is working'));
});

export default router;
