import { Router } from 'express';
import { successResponse } from '../../../shared/response';

const router = Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Example endpoint for notifications
 *     tags: [notifications]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => {
  res.status(200).json(successResponse({}, 'notifications module is working'));
});

export default router;
