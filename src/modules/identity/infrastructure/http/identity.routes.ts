import { Router } from 'express';
import { AuthController } from './AuthController';
import { userController } from './UserController';
import { authMiddleware } from '../../../../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /identity/register:
 *   post:
 *     summary: Register a new user
 *     tags: [identity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               name: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /identity/login:
 *   post:
 *     summary: Login a user
 *     tags: [identity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /identity/profile:
 *   get:
 *     summary: Retrieve the authenticated user's profile
 *     tags: [identity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/profile', authMiddleware, userController.getProfile);

export default router;
