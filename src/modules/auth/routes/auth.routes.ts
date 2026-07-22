import { Router } from 'express';
import { successResponse } from '../../../shared/response';

const router = Router();

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Example endpoint for auth
 *     tags: [auth]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({}, 'auth module is working'));
});

export default router;
