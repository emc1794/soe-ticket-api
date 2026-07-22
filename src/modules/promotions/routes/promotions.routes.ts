import { Router } from 'express';
import { successResponse } from '../../../shared/response';

const router = Router();

/**
 * @swagger
 * /promotions:
 *   get:
 *     summary: Example endpoint for promotions
 *     tags: [promotions]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({}, 'promotions module is working'));
});

export default router;
