import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 */
router.get('/', userController.getAll);

export default router;
