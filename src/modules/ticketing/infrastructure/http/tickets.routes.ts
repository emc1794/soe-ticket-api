import { Router } from 'express';
import { successResponse } from '../../../../shared/response';

const router = Router();

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Example endpoint for tickets
 *     tags: [tickets]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({}, 'tickets module is working'));
});

export default router;
