import { Router } from 'express';
import { userController } from './user.controller';
import { authMiddleware } from '../../../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Retrieve the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/profile', authMiddleware, userController.getProfile);

export default router;
