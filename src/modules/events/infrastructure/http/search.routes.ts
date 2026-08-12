import { Router } from 'express';
import { successResponse } from '../../../../shared/response';

const router = Router();

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Example endpoint for search
 *     tags: [search]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({}, 'search module is working'));
});

export default router;
