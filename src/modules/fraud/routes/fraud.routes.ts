import { Router } from 'express';
import { successResponse } from '../../../shared/response';

const router = Router();

/**
 * @swagger
 * /fraud:
 *   get:
 *     summary: Example endpoint for fraud
 *     tags: [fraud]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({}, 'fraud module is working'));
});

export default router;
